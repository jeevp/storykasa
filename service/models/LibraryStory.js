const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class LibraryStory {
    constructor({
        id,
        createdAt,
        storyId,
        profileId,
        libraryId
    }) {
        this.id = id
        this.createdAt = createdAt
        this.storyId = storyId
        this.profileId = profileId
        this.libraryId = libraryId
    }

    static async create({ storyId, profileId, accountId, libraryId }, { accessToken }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            story_id: storyId,
            profile_id: profileId,
            account_id: accountId,
            library_id: libraryId
        },
        {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return response.data
    }

    static async delete({ storyId, profileId, libraryId, accountId }, { accessToken }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                story_id: `eq.${storyId}`,
                library_id: `eq.${libraryId}`,
                profile_id: `eq.${profileId}`,
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data
    }

    static async findOne({ libraryId, storyId }, { accessToken }) {
        if (!libraryId || !storyId) {
            throw new Error("libraryId and storyId cannot be null")
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`,
                story_id: `eq.${storyId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        const libraryStory =  response.data[0]

        if (!libraryStory) return null

        return new LibraryStory({
            id: libraryStory?.id,
            createdAt: libraryStory?.created_at,
            storyId: libraryStory?.story_id,
            profileId: libraryStory?.profile_id,
            libraryId: libraryStory?.library_id
        })
    }
}

module.exports = LibraryStory
