import supabase from "../supabase";
import SharedLibraryInvitation from "../models/SharedLibraryInvitation"
import Library from "../models/Library"
import Profile from "../models/Profile"
import APIValidator from "../validators/APIValidator"
const EmailService = require("../services/EmailService/EmailService").default

export default class SharedLibraryInvitationController {
    static async updateSharedLibraryInvitation(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const sharedLibraryInvitation = await SharedLibraryInvitation.findOne({ id: req.query.sharedLibraryInvitationId })

            if (!sharedLibraryInvitation) {
                return res.status(404).send({ message: "Shared library invitation not found." })
            }

            const { accept } = req.body

            const _sharedLibraryInvitation = await sharedLibraryInvitation.update({
                accept,
                complete: true
            })

            // Update library to include this user
            const library = await Library.findOne({ libraryId: sharedLibraryInvitation.libraryId })
            if (!library) return res.status(404).send({ message: "Library not found" })

            await library.update({ sharedAccountIds: [...library.sharedAccountIds, user.id] })

            return res.status(200).send(_sharedLibraryInvitation)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSharedLibraryInvitations(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)
            const sharedLibrariesInvitations = await SharedLibraryInvitation.findAll({ userEmail: user.email, complete: false })

            const sharedLibrariesInvitationsSerialized = []
            await Promise.all((sharedLibrariesInvitations.map(async(sharedLibraryInvitation) => {
                const sharedLibraryInvitationSerialized = await sharedLibraryInvitation.serializer()
                sharedLibrariesInvitationsSerialized.push(sharedLibraryInvitationSerialized)
            })))

            return res.status(200).send(sharedLibrariesInvitationsSerialized)
        } catch (error) {
            return res.status(400).send({  message: "Something went wrong." })
        }
    }

    static async createSharedLibraryInvitations(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, { requiredParams: ["libraryId"] })
            APIValidator.requiredPayload({ req, res }, { requiredPayload: ["listenersEmails"] })

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const { listenersEmails, profileId} = req.body
            const { libraryId } = req.query

            const library = await Library.findOne({ libraryId })

            const profile = await Profile.getProfile(profileId)

            if (!library) {
                return res.status(404).send({ message: "Library not found" })
            }

            const invitationsSummary = []
            for (const listenerEmail of listenersEmails) {
                const sharedLibraryInvitation = await SharedLibraryInvitation.create({
                    libraryId,
                    userEmail: listenerEmail
                })

                invitationsSummary.push({
                    listenerEmail,
                    invited: Boolean(sharedLibraryInvitation)
                })

                await EmailService.sendListenerInvitationEmail({
                    to: listenerEmail,
                    subject: "You are invited to join a collection"
                }, {
                    collectionTitle: library?.libraryName,
                    collectionOwnerName: profile?.profileName
                })
            }

            return res.status(201).send(invitationsSummary)
        } catch (error) {
            console.error(error)
            return res.status(400).send(error)
        }
    }
}
