import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";

interface createStoryProps {
    recordingURL: string
    duration: string
    recordedBy: string
    title: string,
    description: string
    language: string
    ageGroup: string
    illustrationsURL: Array<string>
}

export default class StoryHandler {
    static async createStory({
        recordingURL,
        duration,
        recordedBy,
        title,
        description,
        language,
        ageGroup,
        illustrationsURL
    }: createStoryProps) {
        const payload = {
            isPublic: false,
            title: title,
            recordedBy: recordedBy,
            recordingURL: recordingURL,
            description: description,
            language: language,
            ageGroup: ageGroup,
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

    static async fetchStories() {
        const headers = generateHeaders()
        const response = await axios.get("/api/stories/library", headers)

        return response.data
    }

    static async fetchPublicStories() {
        const headers = generateHeaders()
        const response = await axios.get("/api/stories/discover", headers)
        return response.data
    }
}
