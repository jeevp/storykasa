const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class LikedStories {
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

    static async create({ storyId, profileId }, { accessToken }) {
        if (!storyId || !profileId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/liked_stories`, {
            story_id: storyId,
            profile_id: profileId
        },
        {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return response.data
    }
}

module.exports = LikedStories
