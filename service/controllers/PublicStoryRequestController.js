const supabase = require('../../service/supabase');
const APIValidator = require("../validators/APIValidator");
const PublicStoryRequest = require("../models/PublicStoryRequest");
const Story = require("../models/Story")
const {allowedAdminUsers} = require("../config");

class PublicStoryRequestController {
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

    static async updatePublicStoryRequest(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["publicStoryRequestId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["approved", "moderatorComment"]
            })

            const { publicStoryRequestId } = req.query
            const { approved, moderatorComment } = req.body


            const publicStoryRequest = await PublicStoryRequest.update({ publicStoryRequestId }, {
                approved,
                completed: true,
                moderatorComment
            })

            if (approved) {
                const story = await Story.getStory(publicStoryRequest.storyId)
                if (!story) {
                    return res.status(404).send({ message: "Story does not exist" })
                }

                await story.update({ isPublic: true })
            }

            return res.status(202).send({ message: "Public story request updated with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = PublicStoryRequestController
