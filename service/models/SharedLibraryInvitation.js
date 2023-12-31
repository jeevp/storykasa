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
    }, { accessToken }) {
        const sharedLibraryInvitationAlreadySent = await SharedLibraryInvitation.findOne({
            userEmail,
            libraryId
        }, { accessToken })

        if (sharedLibraryInvitationAlreadySent) {
            return null
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            library_id: libraryId,
            user_email: userEmail
        }, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return new SharedLibraryInvitation({
            libraryId: response.data[0].library_id,
            userEmail: response.data[0].user_email
        })
    }

    static async findAll({ userEmail, complete }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            params: {
                select: "*",
                user_email: `eq.${userEmail}`,
                complete: `eq.${complete}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data.map((sharedLibraryInvitation) => new SharedLibraryInvitation({
            id: response.data[0].id,
            libraryId: sharedLibraryInvitation.library_id,
            userEmail: sharedLibraryInvitation.user_email,
            accept: sharedLibraryInvitation.accept,
            complete: sharedLibraryInvitation.complete
        }))
    }

    static async findOne({ id, userEmail, libraryId }, { accessToken }) {
        const queryParams = { select: "*" }
        if (id) queryParams.id = `eq.${id}`
        if (userEmail) queryParams.user_email = `eq.${userEmail}`
        if (libraryId) queryParams.library_id = `eq.${libraryId}`

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            params: queryParams,
            headers: generateSupabaseHeaders(accessToken)
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

    async update({ accept, complete }, { accessToken }) {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shared_library_invitations`, {
            accept,
            complete
        }, {
            params: {
                select: "*",
                id: `eq.${this.id}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new SharedLibraryInvitation({
            libraryId: response.data[0].library_id,
            userEmail: response.data[0].user_email,
            accept: response.data[0].accept,
            complete: response.data[0].complete
        })
    }

    async serializer({ accessToken }) {
        const library = await Library.findOne({ libraryId: this.libraryId }, { accessToken }, { serialized: true })

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
