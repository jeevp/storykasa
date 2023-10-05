import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
interface createStoryProps {
    recordingURL: string
    duration: string
    recordedBy: string
    title: string,
    description: string
    language: string
    ageGroup: string
}

export default class StoryHandler {
    static async createStory({
        recordingURL,
        duration,
        recordedBy,
        title,
        description,
        language,
        ageGroup
    }: createStoryProps) {
        const payload = {
            isPublic: false,
            title: title,
            recordedBy: recordedBy,
            recordingURL: recordingURL,
            description: description,
            language: language,
            ageGroup: ageGroup,
            duration: duration
        }

        const headers = generateHeaders()
        await axios.post("/api/stories", payload, headers)
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
