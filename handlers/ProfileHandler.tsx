import axios from "axios"

export default class ProfileHandler {
    static async fetchProfiles() {
        const response = await axios.get("/api/profiles", {
            headers: {
                "access-token": localStorage.getItem("STK_ACCESS_TOKEN")
            }
        })

        return response.data
    }

    static async createProfile({ name,  avatarUrl }: { name: string, avatarUrl: string }) {
        const payload = { name }
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const response = await axios.post(`/api/profiles`, payload,{
            headers: {
                "access-token": localStorage.getItem("STK_ACCESS_TOKEN")
            }
        })

        localStorage.setItem('currentProfileID', "22")


        console.log({ data: response.data })
        return response.data
    }

    static async updateProfile(
        { profileId }: { profileId: string },
        { name, avatarUrl }: { name: string, avatarUrl: string }
    ) {
        const payload = {}
        if (name) payload.name = name
        if (avatarUrl) payload.avatarUrl = avatarUrl

        const response = await axios.put(`/api/profiles/${profileId}`, payload, {
            headers: {
                "access-token": localStorage.getItem("STK_ACCESS_TOKEN")
            }
        })

        return response.data
    }
}
