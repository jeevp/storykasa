import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";
import Story from "@/models/Story";
import PublicStoryRequest from "@/models/PublicStoryRequest"
import Profile from "@/models/Profile";

interface createStoryProps {
    recordingURL: string
    duration: string
    title: string,
    description: string
    language: string
    ageGroups: string
    illustrationsURL: Array<string>
}

interface StoryFilterOptions {
    narrator?: string
    language?: string
    ageGroups?: Array<string>
    storyLengths?: Array<string>
}

interface StoryParameters {
    profileId: string
}

interface CreateStoryParameters {
    profileId?: string
}

export default class StoryHandler {
    static async createStory({
        recordingURL,
        duration,
        title,
        description,
        language,
        ageGroups,
        illustrationsURL
    }: createStoryProps, parameters: CreateStoryParameters) {
        const payload = {
            isPublic: false,
            title: title,
            recordingURL: recordingURL,
            description: description,
            language: language,
            ageGroups: ageGroups,
            duration: duration,
            illustrationsURL
        }

        const headers = generateHeaders()
        await axios.post(`/api/profiles/${parameters.profileId}/stories`, payload, headers)
    }

    static async updateStory({ storyId }: { storyId: string }, {
        title,
        description,
        narratorName
    }: { title: string, description: string, narratorName: string }) {
        const headers = generateHeaders()
        const payload = {}
        // @ts-ignore
        if (title) payload.title = title
        // @ts-ignore
        if (description) payload.description = description
        // @ts-ignore
        if (narratorName) payload.narratorName = narratorName

        await axios.put(`/api/stories/${storyId}`, payload, headers)
    }

    static async deleteStory(storyId: any) {
        const headers = generateHeaders()
        await axios.delete(`/api/stories/${storyId}`, headers)
    }

    static async fetchPrivateStories(filterOptions: StoryFilterOptions, parameters: StoryParameters) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/profiles/${parameters.profileId}/library/stories`, {
            ...headers,
            params: { ...filterOptions }
        })


        return response.data.map((story: any) => new Story({
            storyId: story.story_id,
            isPublic: story.is_public,
            duration: story.duration,
            recordingUrl: story.recording_url,
            recordedBy: story.recorded_by,
            title: story.title,
            ageGroups: story.age_groups || [],
            description: story.description,
            language: story.language,
            profileId: story?.profiles?.profile_id,
            profileName: story?.profiles?.profile_name,
            profileAvatar: story?.profiles?.avatar_url,
            lastUpdated: story?.last_updated,
            illustrationsURL: story?.illustrationsURL,
            publicStoryRequest: story?.publicStoryRequest || {},
            narratorName: story?.narrator_name
        }))
    }

    static async fetchPublicStories(filterOptions: StoryFilterOptions) {
        const headers = generateHeaders()
        const response = await axios.get("/api/stories/discover", {
            ...headers,
            params: { ...filterOptions }
        })

        // @ts-ignore
        return response.data.map((story: any) => new Story({
            storyId: story.story_id,
            isPublic: story.is_public,
            duration: story.duration,
            recordingUrl: story.recording_url,
            recordedBy: story.recorded_by,
            title: story.title,
            ageGroups: story.age_groups || [],
            description: story.description,
            language: story.language,
            profileId: story?.profiles?.profile_id,
            profileName: story?.profiles?.profile_name,
            profileAvatar: story?.profiles?.avatar_url,
            lastUpdated: story?.last_updated,
            illustrationsURL: story?.illustrationsURL,
            narratorName: story?.narrator_name
        }))
    }

    static async fetchStoriesFilters({ profileId }: { profileId: string }) {
        const headers = generateHeaders()

        const response = await axios.get("/api/stories/filters", {
            ...headers,
            params: {
                profileId
            }
        })

        return response.data
    }

    static async addStoryToLibrary({ storyId, profileId }: { storyId: string, profileId: string }) {
        const headers = generateHeaders()

        await axios.post(`/api/profiles/${profileId}/library/stories/${storyId}`, {}, headers)
    }

    static async removeStoryFromLibrary({ storyId, profileId }: { storyId: string, profileId: string }) {
        const headers = generateHeaders()

        await axios.delete(`/api/profiles/${profileId}/library/stories/${storyId}`, headers)
    }

    static async submitToPublicLibrary({ storyId, profileId }: { storyId: string, profileId: string }) {
        const headers = generateHeaders()

        return await axios.post(`/api/profiles/${profileId}/stories/${storyId}/publicStoryRequest`, {}, headers)
    }

    static async fetchPublicStoryRequests() {
        const headers = generateHeaders()

        const response = await axios.get("/api/admin/publicStoryRequests", headers)

        return response.data.map((publicStoryRequest: any) => {
            return new PublicStoryRequest({
                ...publicStoryRequest,
                story: new Story({
                    ...publicStoryRequest.story
                }),
                profile: new Profile({
                    ...publicStoryRequest.profile
                })
            })
        })
    }

    static async updatePublicStoryRequest({ publicStoryRequestId }: { publicStoryRequestId: any }, {
        approved,
        moderatorComment
    }: { approved: boolean, moderatorComment: string }
    ) {
        const headers = generateHeaders()

        await axios.put(`/api/admin/publicStoryRequests/${publicStoryRequestId}`, {
            approved,
            moderatorComment
        }, headers)
    }
}
