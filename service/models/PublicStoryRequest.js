import axios from "axios"
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

class PublicStoryRequest {
    constructor({
        id,
        storyId,
        approved,
        completed,
        profileId
    }) {
        this.id = id
        this.storyId = storyId
        this.approved = approved
        this.completed = completed
        this.profileId = profileId
    }

    static async create({ storyId, profileId }, { accessToken }) {
        if (!storyId) throw new Error("StoryId cannot be null")
        if (!accessToken) throw new Error("Missing access token")

        const validation = await this.validateRequestExistence({ storyId, profileId }, { accessToken })
        if (validation.error) {
            return {
                publicStoryRequest: null,
                error: validation.error
            }
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_request`, {
            story_id: storyId,
            profile_id: profileId
        }, {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return {
            publicStoryRequest: response.data,
            error: null
        }
    }

    static async findAll({ storyIds = [] }, { accessToken }) {
        if (storyIds.length === 0) throw new Error("storyIds must not be empty")

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_request`, {
            params: {
                select: "*",
                story_id: `in.(${storyIds})`
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return response.data.map((publicStoryRequest) => ({
            id: publicStoryRequest.id,
            storyId: publicStoryRequest.story_id,
            profileId: publicStoryRequest.profile_id,
            approved: publicStoryRequest.approved,
            completed: publicStoryRequest.completed
        }))
    }

    static async validateRequestExistence({ storyId, profileId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_request`, {
            params: {
                story_id: `eq.${storyId}`,
                profile_id: `eq.${profileId}`,
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        if (response.data.length > 0) {
            return {
                publicStoryRequest: null,
                error: "A request has already being created for this story."
            }
        }

        return true
    }
}


module.exports = PublicStoryRequest
