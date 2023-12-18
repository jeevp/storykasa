import supabase from "../supabase";
import SharedLibraryInvitation from "../models/SharedLibraryInvitation"

export default class SharedLibraryInvitationController {
    static async updateSharedLibraryInvitation(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const sharedLibraryInvitation = await SharedLibraryInvitation.findOne({ id: req.query.sharedLibraryInvitationId }, { accessToken: req.accessToken })

            if (!sharedLibraryInvitation) {
                return res.status(404).send({ message: "Shared library invitation not found." })
            }

            const { accept } = req.body

            const _sharedLibraryInvitation = await sharedLibraryInvitation.update({
                accept,
                complete: true
            }, { accessToken: req.accessToken })

            return res.status(200).send(_sharedLibraryInvitation)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSharedLibraryInvitations(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)
            const sharedLibrariesInvitations = await SharedLibraryInvitation.findAll({ userEmail: user.email, complete: false }, {
                accessToken: req.accessToken
            })

            const sharedLibrariesInvitationsSerialized = []
            await Promise.all((sharedLibrariesInvitations.map(async(sharedLibraryInvitation) => {
                const sharedLibraryInvitationSerialized = await sharedLibraryInvitation.serializer({ accessToken: req.accessToken })
                sharedLibrariesInvitationsSerialized.push(sharedLibraryInvitationSerialized)
            })))

            return res.status(200).send(sharedLibrariesInvitationsSerialized)
        } catch (error) {
            console.log(error)
            return res.status(400).send({  message: "Something went wrong." })
        }
    }
}
