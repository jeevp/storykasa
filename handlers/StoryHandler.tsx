import axios from "axios";

export default class StoryHandler {
    static async deleteStory(storyId: any) {
        await axios.delete(`/api/stores/${storyId}`)
    }

    static async fetchStories() {
        const accessToken = localStorage.getItem("STK_ACCESS_TOKEN")
        const response = await axios.get("/api/stories", {
            headers: {
                "access-token": accessToken
            }
        })

        return response.data
    }
}
