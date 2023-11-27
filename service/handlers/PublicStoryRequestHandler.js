import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import PublicStoryRequest from "../models/PublicStoryRequest"


class PublicStoryRequestHandler {
    static async getPublicStoryRequests(filters = {}, { accessToken }) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/public_story_requests`,
            {
                params: {
                    select: "*",
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
}

module.exports = PublicStoryRequestHandler
