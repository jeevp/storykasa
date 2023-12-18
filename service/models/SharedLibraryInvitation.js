const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const axios = require("axios");

class SharedLibraryInvitation {
    constructor({
        libraryId,
        userEmail,
        accept,
        complete
    }) {
        this.libraryId = libraryId
        this.userEmail = userEmail
        this.accept = accept
        this.complete = complete
    }

    static async create({
        libraryId,
        userEmail
    }, { accessToken }) {
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
}

module.exports = SharedLibraryInvitation
