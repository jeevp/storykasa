import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";

export default class StoryHandler {
    static async deleteStory(storyId: any) {
        await axios.delete(`/api/stores/${storyId}`)
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
