import supabase from "../supabase";
import Library from "../models/Library"
import SharedLibraryInvitation from "../models/SharedLibraryInvitation"
import APIValidator from "../validators/APIValidator"
import Story from "../models/Story"

export default class LibraryController {
    static async getLibraries(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const libraries = await Library.findAll({
                accountId: user.id
            }, {
                accessToken: req.accessToken
            }, {
                serialized: true
            })

            return res.status(200).send(libraries)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async createLibrary(req, res) {
        try {
            const { libraryName } = req.body
            if (!libraryName) return res.status(400).send({ message: "Payload is incorrect" })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const library = await Library.create({
                libraryName,
                accountId: user.id
            }, { accessToken: req.accessToken })

            const { listenersEmails } = req.body
            if (listenersEmails?.length > 0) {
                // Send the invitation to listeners join the library
                for (const listenerEmail of listenersEmails) {
                    await SharedLibraryInvitation.create({
                        libraryId: library.libraryId,
                        userEmail: listenerEmail
                    }, { accessToken: req.accessToken })
                }
            }


            return res.status(201).send(library)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSharedLibraries(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)
            const libraries = await Library.findAll({ sharedAccountId: user.id }, {
                accessToken: req.accessToken
            }, { serialized: true })

            return res.status(200).send(libraries)
        } catch (error) {
            console.log(error)
            return res.status(400).send({  message: "Something went wrong." })
        }
    }

    static async getStories(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId"]
            })

            const { libraryId } = req.query

            const stories = await Story.findAll({ libraryId }, { accessToken: req.accessToken })

            return res.status(200).send(stories)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async addStoryToLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res },  {
                requiredParams: ["profileId","libraryId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["storyId"]
            })

            const { profileId, libraryId } = req.query
            const { storyId } = req.body

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            await Library.addStory({
                storyId,
                libraryId,
                profileId,
                accountId: user.id
            }, { accessToken: req.accessToken })


            return res.status(201).send({ message: "Story added to library with success." })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
