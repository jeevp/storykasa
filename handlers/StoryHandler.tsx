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
    finished?: boolean
    storyIdeaId?: number
}

interface updateStoryProps {
    title?: string
    description?: string
    narratorName?: string
    recordingURL?: string
    duration?: string
    language?: string
    ageGroups?: string
    illustrationsURL?: Array<string>
    finished?: boolean
    storyIdeaId?: number
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
        illustrationsURL,
        finished,
        storyIdeaId
    }: createStoryProps, parameters: CreateStoryParameters) {
        const payload = {
            isPublic: false,
            title: title,
            recordingURL: recordingURL,
            description: description,
            language: language,
            ageGroups: ageGroups,
            duration: duration,
            illustrationsURL,
            finished,
            storyIdeaId
        }

        const headers = generateHeaders()
        const response = await axios.post(`/api/profiles/${parameters.profileId}/stories`, payload, headers)

        return new Story({
            ...response.data
        })
    }

    static async updateStory({ storyId }: { storyId: string }, {
        title,
        description,
        narratorName,
        recordingURL,
        duration,
        language,
        ageGroups,
        illustrationsURL,
        finished
    }: updateStoryProps) {
        const headers = generateHeaders()
        const payload = {}
        // @ts-ignore
        if (title) payload.title = title
        // @ts-ignore
        if (description) payload.description = description
        // @ts-ignore
        if (narratorName) payload.narratorName = narratorName
        // @ts-ignore
        if (recordingURL || recordingURL === "") payload.recordingURL = recordingURL
        // @ts-ignore
        if (duration) payload.duration = duration
        // @ts-ignore
        if (language) payload.language = language
        // @ts-ignore
        if (ageGroups) payload.ageGroups = ageGroups
        // @ts-ignore
        if (illustrationsURL) payload.illustrationsURL = illustrationsURL
        // @ts-ignore
        if (finished === true || finished === false) payload.finished = finished

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


        return response.data.map((story: any) => {
            // @ts-ignore
            return new Story({
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
                narratorName: story?.narrator_name,
                playCount: story?.play_count
            })
        })
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
            narratorName: story?.narrator_name,
            playCount: story?.play_count
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

    static async fetchTotalRecordingTime() {
        const headers = generateHeaders()

        const response = await axios.get("/api/stories/totalRecordingTime", headers)

        return response.data.totalRecordingTime
    }

    static async updatePlayCount({ storyId }: { storyId: string }) {
        const headers = generateHeaders()

        const response = await axios.put(`/api/stories/${storyId}/playCount`, {}, headers)

        return response.data
    }

    static async fetchUnfinishedStories({ profileId }: { profileId: string }) {
        const headers = generateHeaders()

        const response = await axios.get(
            `/api/profiles/${profileId}/stories/unfinished`,
            headers
        )

        return response.data.map((story: any) => new Story({
            ...story,
            recordingUrl: story.recording_url,
            storyId: story.story_id,
            ageGroups: story.age_groups,
            language: story.language,
            storyIdea: story.storyIdea
        }))
    }

    static async generateStoryIdea({ profileId }: { profileId: string }, {
        isFictional,
        language,
        ageGroups,
        ageGroupsLabel,
        description
    }: {
        isFictional: boolean,
        language: string,
        ageGroups: any[],
        ageGroupsLabel: string
        description: string
    }) {
        const headers = generateHeaders()

        const response = await axios.post(`/api/profiles/${profileId}/storyIdeas`, {
            isFictional,
            language,
            ageGroups,
            description,
            ageGroupsLabel
        }, headers)

        return response.data
    }

    static async getStoryTranscript(storyId: string) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/stories/${storyId}/transcript`, headers)

        return response.data.transcript
    }
}
