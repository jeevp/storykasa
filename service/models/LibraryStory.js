const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const supabase = require("../supabase");

class LibraryStory {
    constructor({
        id,
        createdAt,
        storyId,
        profileId
    }) {
        this.id = id
        this.createdAt = createdAt
        this.storyId = storyId
        this.profileId = profileId
    }

    static async create({ storyId, profileId, accountId }, { accessToken }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const {data: { user }} = await supabase.auth.getUser(accessToken)


        const libraryResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
                params: {
                    select: "*",
                    "account_id": `eq.${user?.id}`
                },
                headers: generateSupabaseHeaders(accessToken)
            }
        )

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            story_id: storyId,
            profile_id: profileId,
            account_id: accountId,
            library_id: libraryResponse?.data[0]?.library_id
        },
        {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return response.data
    }

    static async delete({ storyId, profileId, accountId }, { accessToken }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                story_id: `eq.${storyId}`,
                profile_id: `eq.${profileId}`,
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data
    }
}

module.exports = LibraryStory
