import DecodeJWT from "../../utils/decodeJWT";
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();

if (!fs.existsSync(tmpDir)){
    fs.mkdirSync(tmpDir, { recursive: true });
}
const supabase = require('../../service/supabase');
const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const APIValidator = require("../validators/APIValidator");
const LibraryStory = require("../models/LibraryStory")
const PublicStoryRequest = require("../models/PublicStoryRequest");
const convertArrayToHash = require("../../utils/convertArrayToHash");
const {allowedAdminUsers} = require("../config");
import Story from "../models/Story"
import {RECORD_BUCKET_NAME, STK_ACCESS_TOKEN} from "../../config";
import {v4} from "uuid";
const applyAlphabeticalOrder = require("../../utils/applyAlphabeticalOrder");
const Library = require("../models/Library")
const SubscriptionValidator = require("../validators/SubscriptionValidator")
const Subscription = require("../models/Subscription")
const Account = require("../models/Account")

class StoryController {
    static async deleteStory(req, res) {
        try {
            const { storyId } = req.query

            const response = await axios.patch(`${process.env.SUPABASE_URL}/rest/v1/stories`, {
                deleted: true
            },{
                params: {
                    story_id: `eq.${storyId}`
                },
                headers: generateSupabaseHeaders()
            })

            return res.status(204).send(response.data)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updateStory(req, res) {
        try {
            const { storyId } = req.query
            const { title, description, narratorName } = req.body

            if (!title && !description) {
                return res.status(400).send({
                    message: "Payload is missing"
                })
            }

            const story = await Story.getStory(storyId)

            if (!story) {
                return res.status(404).send({ message: "Story not found" })
            }

            const updatedStory = await story.update({
                title,
                description,
                narratorName
            })

            return res.status(202).send(updatedStory)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getLibraryStories(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, { requiredParams: ["profileId"] })

            APIValidator.optionalParams({
                allowedParams: ["narrator", "language", "ageGroups[]", "storyLengths[]", "profileId"],
                incomeParams: req.query
            }, res)

            const { narrator, language, profileId } = req.query

            const ageGroups = req.query["ageGroups[]"]
            const storyLengths = req.query["storyLengths[]"]

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const library = await Library.findDefaultLibrary({
                accountId: user.id
            })

            const privateStories = await Story.getStories({
                narrator,
                language,
                ageGroups,
                storyLengths,
                private: true
            }, {
                userId: user.id,
                profileId,
                libraryId: library?.libraryId
            })

            if (privateStories.length === 0) return res.status(200).send([])

            let storiesIds = []
            privateStories.forEach((story) => {
                if (story?.story_id) storiesIds.push(story?.story_id)
            })

            if (storiesIds.length > 0) storiesIds = storiesIds.join(',')

            let illustrationParams = { select: "*" }
            if (storiesIds.length > 0) illustrationParams["story_id"] =`in.(${storiesIds})`

            // Stories Illustrations
            const illustrationsResponse = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/stories_images`, {
                params: illustrationParams,
                headers: generateSupabaseHeaders()
            });

            const illustrations = illustrationsResponse.data

            // Public story request
            const publicStoriesRequests = await PublicStoryRequest.findAll({
                storyIds: storiesIds
            })

            const publicStoriesRequestHash = convertArrayToHash(publicStoriesRequests, "storyId")

            const storiesSerialized = privateStories?.map((story) => {
                const publicStoryRequest = publicStoriesRequestHash[story.story_id]
                if (publicStoryRequest) {
                    story.publicStoryRequest = publicStoryRequest
                }
                story.illustrationsURL = illustrations.filter((illustration) => {
                    return illustration?.story_id ===  story?.story_id
                }).map((storyIllustration) => storyIllustration?.image_url)

                return story
            }).sort((a, b) => {
                if (a.library_created_at < b.library_created_at) return 1
                if (a.library_created_at > b.library_created_at) return -1
            })

            return res.status(200).send(storiesSerialized)
        } catch (error) {
            console.error(error)
            res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getDiscoverStories(req, res) {
        try {
            const decodedJWT = DecodeJWT(req.accessToken)
            const isGuestUser = decodedJWT.isGuest

            if (isGuestUser) {
                const publicStories = await Story.getStories({
                    private: false,
                }, {
                    freeTier: true
                })

                return res.status(200).send(publicStories)
            }

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            APIValidator.optionalParams({
                allowedParams: ["narrator", "language", "ageGroups[]", "storyLengths[]"],
                incomeParams: req.query
            }, res)

            const { narrator, language } = req.query
            const ageGroups = req.query["ageGroups[]"]
            const storyLengths = req.query["storyLengths[]"]

            const subscription = await Subscription.findOne({ accountId: user?.id })

            const adminAccount = Account.getAdminAccounts().includes(user.email)

            const publicStories = await Story.getStories({
                narrator,
                language,
                ageGroups,
                storyLengths,
                private: false,
            }, {
                freeTier: !adminAccount && subscription.subscriptionPlan === Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN
            })
            return res.status(200).send(publicStories)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async createStory(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["profileId"]
            })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            let allowActionToProceed = false
            if (Account.getAdminAccounts().includes(user.email)) {
                allowActionToProceed = true
            } else {
                allowActionToProceed = await SubscriptionValidator.validateMaxStoriesRecordingTime({
                    accountId: user.id
                })
            }

            if (!allowActionToProceed) {
                return res.status(400).send({ message: "This account has reached the max stories duration allowed" })
            }

            const audioFile = req.file

            if (!audioFile) {
                return res.status(400).send({ message: "Audio file is required" });
            }

            const outputFilePath = path.join(tmpDir, `${audioFile.originalname.split('.')[0]}.mp3`);

            await new Promise((resolve, reject) => {
                ffmpeg(audioFile.path)
                    .toFormat('mp3')
                    .on('error', (err) => reject(err))
                    .on('end', () => resolve())
                    .save(outputFilePath);
            });

            const fileContents = fs.readFileSync(outputFilePath);
            const uuid = v4();

            // The URL to which you will send the file upload request
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${RECORD_BUCKET_NAME}/${uuid}.mp3`;

            // Sending the upload request using axios
            await axios.post(url, fileContents, {
                headers: generateSupabaseHeaders({
                    contentType: "audio/mpeg"
                }, {
                    // @ts-ignore
                    accessToken: process.env.SUPABASE_SERVICE_ROLE_KEY
                })
            });

            const recordingURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${RECORD_BUCKET_NAME}/${uuid}.mp3`

            const {
                title,
                description,
                isPublic,
                language,
                duration
            } = req.body

            const { profileId } = req.query

            const illustrationsURL = JSON.parse(req.body.illustrationsURL)
            const ageGroups = JSON.parse(req.body.ageGroups)

            const newStory = {
                is_public: isPublic,
                title: title,
                recorded_by: profileId,
                recording_url: recordingURL,
                description: description,
                language: language,
                age_groups: ageGroups,
                duration: duration,
                account_id: user?.id
            }

            const response = await axios.post(
                `${process.env.SUPABASE_URL}/rest/v1/stories`,
                newStory,
                {
                    params: {
                        select: '*'
                    },
                    headers: generateSupabaseHeaders()
                }
            )

            let newStoryID = response.data[0].story_id

            // simulate the story "saving" process by adding it to the library_stories table
            if (newStoryID && user) {
                const defaultLibrary = await Library.findDefaultLibrary({ accountId: user?.id })

                await axios.post(
                    `${process.env.SUPABASE_URL}/rest/v1/library_stories`,
                    {
                        account_id: user.id,
                        story_id: newStoryID,
                        library_id: defaultLibrary.libraryId,
                        profile_id: profileId
                    },
                    {
                        params: {
                            select: '*'
                        },
                        headers: generateSupabaseHeaders()
                    }
                )

                const createdStory = response.data[0]

                // Let's add the illustrations
                illustrationsURL.map(async(illustrationURL) => {
                    await axios.post(
                        `${process.env.SUPABASE_URL}/rest/v1/stories_images`,
                        {
                            image_url: illustrationURL,
                            story_id: createdStory?.story_id
                        },
                        {
                            params: {
                                select: '*'
                            },
                            headers: generateSupabaseHeaders()
                        }
                    )
                })

            }

            fs.unlink(outputFilePath, (err) => {});

            if (audioFile && audioFile.path) {
                fs.unlink(audioFile.path, (err) => {})
            }

            return res.status(201).send({ message: "Story created with success" })
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getStoriesFilters(req, res) {
        try {
            let userId = null
            if (req.query.profileId) {
                const { data: { user } } = await supabase.auth.getUser(req.accessToken)
                userId = user.id
            }

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const library = await Library.findDefaultLibrary({ accountId: user.id })

            let stories = await Story.getStories({
                private: Boolean(req.query.profileId)
            }, {
                userId,
                profileId: req.query.profileId,
                libraryId: library?.libraryId
            })

            const uniqueNarrators = new Set();
            const uniqueLanguages = new Set()

            const narrators = stories.reduce((acc, story) => {
                const narratorName = story?.narrator_name || story?.profiles?.profile_name;
                if (!uniqueNarrators.has(narratorName)) {
                    uniqueNarrators.add(narratorName);
                    acc.push({ narratorName });
                }

                return acc;
            }, []).filter((narrator) => narrator?.narratorName !== undefined)

            const languages = stories.reduce((acc, story) => {
                if (!uniqueLanguages.has(story.language)) {
                    uniqueLanguages.add(story.language);
                    acc.push({ language: story.language });
                }

                return acc;
            }, [])

            return res.status(200).send({
                narrators: applyAlphabeticalOrder(narrators, "narratorName"),
                languages: applyAlphabeticalOrder(languages, "language")
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async addStoryToLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["storyId", "profileId"]
            })

            const { storyId, profileId } = req.query

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const defaultLibrary = await Library.findDefaultLibrary({ accountId: user.id })

            await LibraryStory.create({
                storyId,
                profileId,
                accountId: user.id,
                libraryId: defaultLibrary?.libraryId
            })

            return res.status(201).send({ message: "Story added to library with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async removeStoryFromLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["storyId", "profileId"]
            })

            const { storyId, profileId } = req.query

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const defaultLibrary = await Library.findDefaultLibrary({ accountId: user.id })

            await LibraryStory.delete({
                storyId,
                libraryId: defaultLibrary.libraryId,
                profileId,
                accountId: user.id
            })

            return res.status(204).send({ message: "Story removed from library with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async submitStoryToPublicLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["storyId", "profileId"]
            })

            const { storyId, profileId } = req.query

            const { publicStoryRequest, error } = await PublicStoryRequest.create({ storyId, profileId })

            if (error) return res.status(200).send({ message: error })

            return res.status(201).send({ message: "Public story request has been created with success." })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getPublicStoryRequests(req, res) {
        try {
            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            if (!allowedAdminUsers.includes(user.email)) {
                return res.status(401).send({ message: "Not allowed" })
            }

            const publicStoryRequests = await PublicStoryRequest.getPublicStoryRequests({})

            const publicStoryRequestsSerialized = []
            await Promise.all(publicStoryRequests.map(async(publicStoryRequest) => {
                const publicStoryRequestSerialized = await publicStoryRequest.serializer()

                publicStoryRequestsSerialized.push(publicStoryRequestSerialized)
            }))

            return res.status(200).send(publicStoryRequestsSerialized)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getTotalRecordingTime(req, res) {
        try {
            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const totalRecordingTime = await Library.getTotalRecordingTime({ accountId: user?.id })

            return res.status(200).send({ totalRecordingTime })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updatePlayCount(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, { requiredParams: ["storyId"] })

            const story = await Story.getStory(req.query.storyId)
            await story.update({ playCount: story.playCount + 1 })

            return res.status(202).send({ message: "Play count updated with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = StoryController
