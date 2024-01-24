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

    static async create({ storyId, profileId }) {
        if (!storyId) throw new Error("StoryId cannot be null")

        const validation = await this.validateRequestExistence({ storyId, profileId })
        if (validation.error) {
            return {
                publicStoryRequest: null,
                error: validation.error
            }
        }

        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/public_story_requests`, {
            story_id: storyId,
            profile_id: profileId
        }, {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders()
        })

        return {
            publicStoryRequest: response.data,
            error: null
        }
    }

    static async update({ publicStoryRequestId }, { approved, completed, moderatorComment }) {

        const response = await axios.patch(
            `${process.env.SUPABASE_URL}/rest/v1/public_story_requests`, {
                approved,
                completed,
                moderator_comment: moderatorComment
            },{
                params: {
                    select: "*",
                    id: `eq.${publicStoryRequestId}`
                },
                headers: generateSupabaseHeaders()
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
    static async findAll({ storyIds = [] }) {
        if (storyIds.length === 0) throw new Error("storyIds must not be empty")

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/public_story_requests`, {
            params: {
                select: "*",
                story_id: `in.(${storyIds})`
            },
            headers: generateSupabaseHeaders()
        })


        return response.data.map((publicStoryRequest) => ({
            id: publicStoryRequest.id,
            storyId: publicStoryRequest.story_id,
            profileId: publicStoryRequest.profile_id,
            approved: publicStoryRequest.approved,
            completed: publicStoryRequest.completed,
            moderatorComment: publicStoryRequest.moderator_comment
        }))
    }

    static async validateRequestExistence({ storyId, profileId }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/public_story_requests`, {
            params: {
                story_id: `eq.${storyId}`,
                profile_id: `eq.${profileId}`,
            },
            headers: generateSupabaseHeaders()
        })

        if (response.data.length > 0) {
            return {
                publicStoryRequest: null,
                error: "A request has already being created for this story."
            }
        }

        return true
    }

    static async getPublicStoryRequests(filters = {}) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/public_story_requests`,
            {
                params: {
                    select: "*",
                    completed: `eq.false`
                },
                headers: generateSupabaseHeaders()
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

    async serializer() {
        const story = await Story.getStory(this.storyId)
        const profile = await Profile.getProfile(this.profileId)

        return {
            ...this,
            story,
            profile
        }
    }
}


module.exports = PublicStoryRequest
