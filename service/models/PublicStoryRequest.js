import axios from "axios"
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import Story from "../models/Story"
import Profile from "../models/Profile";


class PublicStoryRequest {
    constructor({
        id,
        storyId,
        approved,
        completed,
        profileId,
        createdAt
    }) {
        this.id = id
        this.storyId = storyId
        this.approved = approved
        this.completed = completed
        this.profileId = profileId
        this.createdAt = createdAt
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

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`, {
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

    static async update({ publicStoryRequestId }, { approved, completed }, { accessToken }) {

        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`, {
                approved,
                completed
            },{
                params: {
                    select: "*",
                    id: `eq.${publicStoryRequestId}`
                },
                headers: generateSupabaseHeaders(accessToken)
            }
        )

        const publicStoryRequest = response.data[0]

        return new PublicStoryRequest({
            id: publicStoryRequest.id,
            storyId: publicStoryRequest.story_id,
            approved: publicStoryRequest.approved,
            completed: publicStoryRequest.completed,
            profileId: publicStoryRequest.profile_id,
            createdAt: publicStoryRequest.created_at
        })
    }
    static async findAll({ storyIds = [] }, { accessToken }) {
        if (storyIds.length === 0) throw new Error("storyIds must not be empty")

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`, {
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`, {
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

    static async getPublicStoryRequests(filters = {}, { accessToken }) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`,
            {
                params: {
                    select: "*",
                    completed: `eq.false`
                },
                headers: generateSupabaseHeaders(accessToken)
            }
        )

        const publicStoryRequests = response.data.map((publicStoryRequest) => {
            return new PublicStoryRequest({
                id: publicStoryRequest.id,
                storyId: publicStoryRequest.story_id,
                approved: publicStoryRequest.approved,
                completed: publicStoryRequest.completed,
                profileId: publicStoryRequest.profile_id,
                createdAt: publicStoryRequest.created_at
            })
        })

        return publicStoryRequests
    }

    async serializer(accessToken) {
        const story = await Story.getStory(this.storyId, accessToken)
        const profile = await Profile.getProfile(this.profileId, accessToken)

        return {
            ...this,
            story,
            profile
        }
    }
}


module.exports = PublicStoryRequest
