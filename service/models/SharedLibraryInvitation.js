const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const axios = require("axios");
import Library from "../models/Library"
import ApiError from "../utils/ApiError"

class SharedLibraryInvitation {
    constructor({
        id,
        libraryId,
        userEmail,
        accept,
        complete
    }) {
        this.id = id
        this.libraryId = libraryId
        this.userEmail = userEmail
        this.accept = accept
        this.complete = complete
    }

    static async create({
        libraryId,
        userEmail
    }) {
        const sharedLibraryInvitationAlreadySent = await SharedLibraryInvitation.findOne({
            userEmail,
            libraryId
        })

        if (sharedLibraryInvitationAlreadySent) {
            return null
        }

        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            library_id: libraryId,
            user_email: userEmail
        }, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders()
        })


        return new SharedLibraryInvitation({
            libraryId: response.data[0].library_id,
            userEmail: response.data[0].user_email
        })
    }

    static async findAll({ userEmail, complete }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            params: {
                select: "*",
                user_email: `eq.${userEmail}`,
                complete: `eq.${complete}`
            },
            headers: generateSupabaseHeaders()
        })

        return response.data.map((sharedLibraryInvitation) => new SharedLibraryInvitation({
            id: response.data[0].id,
            libraryId: sharedLibraryInvitation.library_id,
            userEmail: sharedLibraryInvitation.user_email,
            accept: sharedLibraryInvitation.accept,
            complete: sharedLibraryInvitation.complete
        }))
    }

    static async findOne({ id, userEmail, libraryId }) {
        const queryParams = { select: "*" }
        if (id) queryParams.id = `eq.${id}`
        if (userEmail) queryParams.user_email = `eq.${userEmail}`
        if (libraryId) queryParams.library_id = `eq.${libraryId}`

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            params: queryParams,
            headers: generateSupabaseHeaders()
        })

        if (!response.data[0]) {
            return null
        }

        return new SharedLibraryInvitation({
            id: response.data[0]?.id,
            libraryId: response.data[0]?.library_id,
            userEmail: response.data[0]?.user_email,
            accept: response.data[0]?.accept,
            complete: response.data[0]?.complete
        })
    }

    async update({ accept, complete }) {
        const response = await axios.patch(`${process.env.SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            accept,
            complete
        }, {
            params: {
                select: "*",
                id: `eq.${this.id}`
            },
            headers: generateSupabaseHeaders()
        })

        return new SharedLibraryInvitation({
            libraryId: response.data[0].library_id,
            userEmail: response.data[0].user_email,
            accept: response.data[0].accept,
            complete: response.data[0].complete
        })
    }

    async serializer() {
        const library = await Library.findOne({ libraryId: this.libraryId }, { serialized: true })

        return {
            id: this.id,
            libraryId: this.libraryId,
            userEmail: this.userEmail,
            accept: this.accept,
            complete: this.complete,
            library
        }
    }
}

module.exports = SharedLibraryInvitation
