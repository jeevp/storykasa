const supabase = require('../../service/supabase');
const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const StoryServiceHandler = require("../handlers/StoryServiceHandler")
const APIValidator = require("../validators/APIValidator");
const LikedStories = require("../models/LikedStories")


class StoryController {
    static async deleteStory(req, res) {
        try {
            const { storyId } = req.query

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`, {
                params: {
                    story_id: `eq.${storyId}`
                },
                headers: generateSupabaseHeaders(req.accessToken)
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
            const { title, description } = req.body

            if (!title && !description) {
                return res.status(400).send({
                    message: "Payload is missing"
                })
            }

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`, {
              title, description
            }, {
                params: {
                    story_id: `eq.${storyId}`
                },
                headers: generateSupabaseHeaders(req.accessToken)
            })

            return res.status(202).send(response.data)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getLibraryStories(req, res) {
        try {
            APIValidator.optionalParams({
                allowedParams: ["narrator", "language", "ageGroups[]", "storyLengths[]"],
                incomeParams: req.query
            }, res)

            const { narrator, language } = req.query

            const ageGroups = req.query["ageGroups[]"]
            const storyLengths = req.query["storyLengths[]"]

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const privateStories = await StoryServiceHandler.getStories({
                narrator,
                language,
                ageGroups,
                storyLengths,
                private: true
            }, {
                accessToken: req.accessToken,
                userId: user.id
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
            const illustrationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories_images`, {
                params: illustrationParams,
                headers: generateSupabaseHeaders(req.accessToken)
            });

            const illustrations = illustrationsResponse.data

            const storiesSerialized = privateStories?.map((story) => {
                story.illustrationsURL = illustrations.filter((illustration) => {
                    return illustration?.story_id ===  story?.story_id
                }).map((storyIllustration) => storyIllustration?.image_url)

                return story
            }).sort((a, b) => {
                if (a.created_at < b.created_at) return 1
                if (a.created_at > b.created_at) return -1
            })

            return res.status(200).send(storiesSerialized)
        } catch (error) {
            console.error(error)
            res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getDiscoverStories(req, res) {
        try {
            APIValidator.optionalParams({
                allowedParams: ["narrator", "language", "ageGroups[]", "storyLengths[]"],
                incomeParams: req.query
            }, res)

            const { narrator, language } = req.query
            const ageGroups = req.query["ageGroups[]"]
            const storyLengths = req.query["storyLengths[]"]

            const publicStories = await StoryServiceHandler.getStories({
                narrator,
                language,
                ageGroups,
                storyLengths,
                private: false
            }, { accessToken: req.accessToken })
            return res.status(200).send(publicStories)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async createStory(req, res) {
        try {
            const {
                title,
                description,
                isPublic,
                recordedBy,
                language,
                ageGroups,
                recordingURL,
                duration,
                illustrationsURL
            } = req.body

            const newStory = {
                is_public: isPublic,
                title: title,
                recorded_by: recordedBy,
                recording_url: recordingURL,
                description: description,
                language: language,
                age_groups: ageGroups,
                duration: duration
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`,
                newStory,
                {
                    params: {
                        select: '*'
                    },
                    headers: generateSupabaseHeaders(req.accessToken)
                }
            )

            let newStoryID = response.data[0].story_id

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            // simulate the story "saving" process by adding it to the library_stories table
            if (newStoryID && user) {
                const libraryResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
                        params: {
                            select: "*",
                            "account_id": `eq.${user?.id}`
                        },
                        headers: generateSupabaseHeaders(req.accessToken)
                    }
                )

                const storyResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`,
                    {
                        account_id: user.id,
                        story_id: newStoryID,
                        library_id: libraryResponse?.data[0]?.library_id
                    },
                    {
                        params: {
                            select: '*'
                        },
                        headers: generateSupabaseHeaders(req.accessToken)
                    }
                )

                const createdStory = response.data[0]

                // Let's add the illustrations
                illustrationsURL.map(async(illustrationURL) => {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories_images`,
                        {
                            image_url: illustrationURL,
                            story_id: createdStory?.story_id
                        },
                        {
                            params: {
                                select: '*'
                            },
                            headers: generateSupabaseHeaders(req.accessToken)
                        }
                    )
                })

            }

            return res.status(201).send({ message: "Story created with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getStoriesFilters(req, res) {
        try {
            let userId = null
            if (req.query.private) {
                const { data: { user } } = await supabase.auth.getUser(req.accessToken)
                userId = user.id
            }

            let stories = await StoryServiceHandler.getStories({
                private: req.query.private === 'true'
            }, { accessToken: req.accessToken, userId })

            const uniqueNarrators = new Set();
            const uniqueLanguages = new Set()

            const narrators = stories.reduce((acc, story) => {
                const narratorName = story?.profiles?.profile_name;
                if (!uniqueNarrators.has(narratorName)) {
                    uniqueNarrators.add(narratorName);
                    acc.push({ narratorName });
                }

                return acc;
            }, []);

            const languages = stories.reduce((acc, story) => {
                if (!uniqueLanguages.has(story.language)) {
                    uniqueLanguages.add(story.language);
                    acc.push({ language: story.language });
                }

                return acc;
            }, []);

            return res.status(200).send({
                narrators,
                languages
            })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async addStoryToLibrary(req, res) {
        try {
            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["storyId", "profileId"]
            })

            const { storyId, profileId } = req.body

            await LikedStories.create({ storyId, profileId }, {
                accessToken: req.accessToken
            })

            return res.status(201).send({ message: "Story added to library with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = StoryController
