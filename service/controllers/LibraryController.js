import supabase from "../supabase";
import APIValidator from "../validators/APIValidator"
const Library = require("../models/Library")
const SharedLibraryInvitation = require("../models/SharedLibraryInvitation")
import LibraryStory from "../models/LibraryStory"


export default class LibraryController {
    static async getLibraries(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const libraries = await Library.findAll({
                accountId: user.id
            }, {
                serialized: true
            })

            let _libraries = libraries.sort((a, b) => {
                if (a.createdAt > b.createdAt) return 1
                if (a.createdAt < b.createdAt) return -1
            })

            if (_libraries.length > 0) libraries.shift()

            return res.status(200).send(_libraries)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async createLibrary(req, res) {
        try {
            const { libraryName, profileId } = req.body
            if (!libraryName) return res.status(400).send({ message: "Payload is incorrect" })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const library = await Library.create({
                libraryName,
                accountId: user.id,
                profileId
            })

            const { listenersEmails } = req.body
            if (listenersEmails?.length > 0) {
                // Send the invitation to listeners join the library
                for (const listenerEmail of listenersEmails) {
                    await SharedLibraryInvitation.create({
                        libraryId: library.libraryId,
                        userEmail: listenerEmail
                    })
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
            const libraries = await Library.findAll({ sharedAccountId: user.id }, { serialized: true })

            return res.status(200).send(libraries)
        } catch (error) {
            return res.status(400).send({  message: "Something went wrong." })
        }
    }

    static async getStories(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId"]
            })

            const { libraryId } = req.query

            const stories = await LibraryStory.findAll({ libraryId })

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
            })


            return res.status(201).send({ message: "Story added to library with success." })
        } catch (error) {
            return res.status(error.statusCode || 400).send({ message: error.message || "Something went wrong"})
        }
    }

    static async removeStoryFromLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["profileId", "libraryId", "storyId"]
            })

            const { profileId, libraryId, storyId } = req.query

            await Library.removeStory({
                storyId,
                libraryId,
                profileId
            })

            return res.status(204).send({})
        } catch (error) {
            console.error(error)
            return res.status(error.statusCode || 400).send({ message: error.message || "Something went wrong" })
        }
    }
}
