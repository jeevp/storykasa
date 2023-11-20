import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";
import Story from "@/models/Story";

interface createStoryProps {
    recordingURL: string
    duration: string
    recordedBy: string
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

export default class StoryHandler {
    static async createStory({
        recordingURL,
        duration,
        recordedBy,
        title,
        description,
        language,
        ageGroups,
        illustrationsURL
    }: createStoryProps) {
        const payload = {
            isPublic: false,
            title: title,
            recordedBy: recordedBy,
            recordingURL: recordingURL,
            description: description,
            language: language,
            ageGroups: ageGroups,
            duration: duration,
            illustrationsURL
        }

        const headers = generateHeaders()
        await axios.post("/api/stories", payload, headers)
    }

    static async updateStory({ storyId }: { storyId: string }, {
        title,
        description
    }: { title: string, description: string }) {
        const headers = generateHeaders()
        const payload = {}
        // @ts-ignore
        if (title) payload.title = title
        // @ts-ignore
        if (description) payload.description = description

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
            illustrationsURL: story?.illustrationsURL
        }))
    }

    static async fetchPublicStories(filterOptions: StoryFilterOptions) {
        const headers = generateHeaders()
        const response = await axios.get("/api/stories/discover", {
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
            illustrationsURL: story?.illustrationsURL
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
}
