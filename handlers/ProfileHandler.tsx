import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import {STK_ACCESS_TOKEN} from "@/config";

export default class ProfileHandler {
    static async fetchProfiles() {
        try {
            const headers = generateHeaders()
            const response = await axios.get("/api/profiles", headers)
            console.log(response.data)
            return response.data
        } catch (error) {
            localStorage.removeItem(STK_ACCESS_TOKEN)
        }
    }

    static async createProfile({ name,  avatarUrl }: { name: string, avatarUrl: string }) {
        const payload = { name }
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const headers = generateHeaders()

        const response = await axios.post(`/api/profiles`, payload, headers)

        localStorage.setItem('currentProfileID', "22")

        return response.data
    }

    static async updateProfile(
        { profileId }: { profileId: string },
        { name, avatarUrl }: { name: string, avatarUrl: string }
    ) {
        const headers = generateHeaders()
        const payload = {}
        if (name) payload.name = name
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const response = await axios.put(`/api/profiles/${profileId}`, payload, headers)

        return response.data
    }
}
