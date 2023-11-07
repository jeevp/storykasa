import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import {STK_ACCESS_TOKEN} from "@/config";
import Profile from "@/models/Profile";

export default class ProfileHandler {
    static async fetchProfiles() {
        try {
            const headers = generateHeaders()
            const response = await axios.get("/api/profiles", headers)
            return response.data
        } catch (error) {
            localStorage.removeItem(STK_ACCESS_TOKEN)
        }
    }

    static async createProfile({ name,  avatarUrl }: { name: string, avatarUrl: string }) {
        const payload = { name }
        // @ts-ignore
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const headers = generateHeaders()


        const response = await axios.post(`/api/profiles`, payload, headers)

        return new Profile({
            profileName: response.data.profile_name,
            profileId: response.data.profile_id,
            avatarUrl: response.data.avatar_url
        })
    }

    static async updateProfile(
        { profileId }: { profileId: string },
        { name, avatarUrl }: { name: string, avatarUrl: string }
    ) {
        const headers = generateHeaders()
        const payload = {}
        // @ts-ignore
        if (name) payload.name = name
        // @ts-ignore
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const response = await axios.put(`/api/profiles/${profileId}`, payload, headers)

        return response.data
    }
}
