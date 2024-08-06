import supabase from "../supabase";
import APIValidator from "../validators/APIValidator"
const Library = require("../models/Library")
const SharedLibraryInvitation = require("../models/SharedLibraryInvitation")
import LibraryStory from "../models/LibraryStory"
import Organization from "../models/Organization";


export default class LibraryController {
    static async getLibraries(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const { includeShared } = req.query

            const defaultLibrary = await Library.findDefaultLibrary({ accountId: user?.id })

            const privateLibraries = await Library.findAll({
                accountId: user.id,
                idsToExclude: [defaultLibrary.libraryId]
            }, {
                serialized: true
            })

            let sharedLibraries = []
            if (includeShared) {
                sharedLibraries = await Library.findAll({
                    sharedAccountId: user.id
                }, {
                    serialized: true
                })
            }


            const libraries = [...privateLibraries, ...sharedLibraries]

            let _libraries = libraries.sort((a, b) => {
                if (a.createdAt > b.createdAt) return 1
                if (a.createdAt < b.createdAt) return -1
            }).filter((library) => library.libraryId !== defaultLibrary.libraryId)

            return res.status(200).send(_libraries)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async createLibrary(req, res) {
        try {
            const { libraryName, profileId, organizationId } = req.body
            if (!libraryName) return res.status(400).send({ message: "Payload is incorrect" })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            let organization = null

            if (organizationId) {
                organization = await Organization.findOne({ id: organizationId })
                if (organization.accountId !== user.id) {
                    return res.status(401).send({ message: "Not allowed" })
                }
            }

            const libraryAttributes = {
                libraryName,
                accountId: user.id,
                profileId
            }

            if (organization) libraryAttributes.organizationId = organization.id

            const library = await Library.create({ ...libraryAttributes })

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

    static async deleteLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId", "profileId"]
            })

            const { libraryId, profileId } = req.query

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const library = await Library.findOne({ libraryId })

            if (!library) {
                return res.status(404).send({ message: "Library not found" })
            }

            if (library.accountId !== user.id) {
                return res.status(401).send({ message: "Not authorized" })
            }

            await library.delete()

            return res.status(204).send({ message: "Deleted with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async updateLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId", "profileId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["libraryName"]
            })

            const { libraryId } = req.query

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const library = await Library.findOne({ libraryId })

            if (!library) {
                return res.status(404).send({ message: "Library not found" })
            }

            if (library.accountId !== user.id) {
                return res.status(401).send({ message: "Not authorized" })
            }

            const { libraryName } = req.body

            const updatedLibrary = await library.update({ libraryName })

            return res.status(202).send(updatedLibrary)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getLibrary(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId", "profileId"]
            })

            const { libraryId } = req.query

            const library = await Library.findOne({ libraryId }, { serialized: true })

            return res.status(200).send(library)
        } catch {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async removeListener(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["libraryId", "profileId", "listenerAccountId"]
            })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const { libraryId, listenerAccountId } = req.query

            const library = await Library.findOne({ libraryId })

            if (user?.id !== library?.accountId && user?.id !== listenerAccountId) {
                return res.status(401).send({ message: "Not allowed" })
            }

            await library.removeListener(listenerAccountId)

            return res.status(204).send({ message: "Listener removed with success." })
        } catch {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
