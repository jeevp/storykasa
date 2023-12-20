import supabase from "../supabase";
import Library from "../models/Library"
import SharedLibraryInvitation from "../models/SharedLibraryInvitation"

export default class LibraryController {
    static async getLibraries(req, res) {
        const {data: { user }} = await supabase.auth.getUser(req.accessToken)

        const libraries = await Library.findAll({
            accountId: user.id
        }, {
            accessToken: req.accessToken
        }, {
            serialized: true
        })

        return res.status(200).send(libraries)
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
}
