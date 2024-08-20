import axios from "axios"
import Profile from "@/models/Profile"
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN, STK_PROFILE_ID } from "@/config"
import identifyPendoVisitor from "@/tools/Pendo/identifyPendoVisitor";
import generateHeaders from "@/handlers/generateHeaders";

export default class AuthHandler {
    static async signUp({
        email,
        password,
        fullName,
        termsAgreed,
        browserVersion,
        browserName
    }: {
        email: string,
        password: string,
        fullName: string,
        termsAgreed: boolean,
        browserVersion: string,
        browserName: string

    }) {
        const response = await axios.post("/api/auth/signUp", {
            email,
            password,
            fullName,
            termsAgreed,
            browserVersion,
            browserName
        })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)
        localStorage.setItem(STK_PROFILE_ID, response?.data?.profile?.profile_id)

        identifyPendoVisitor({ userId: response.data.user.id })

        return {
            ...response.data,
            profile: new Profile({
                profileName: response.data.profile.profile_name,
                profileId: response.data.profile.profile_id,
                avatarUrl: response.data.profile.avatar_url
            })
        }
    }

    static async signInWithPassword({ email, password }: { email: string, password: string }) {
        const response = await axios.post("/api/auth/signIn", {
            email,
            password
        })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)
        localStorage.setItem(STK_PROFILE_ID, response?.data?.defaultProfile?.profile_id)

        return response.data
    }

    static async signOut() {
        await axios.post("/api/auth/signOut")
        localStorage.removeItem(STK_ACCESS_TOKEN)
        localStorage.removeItem(STK_REFRESH_TOKEN)
        localStorage.removeItem(STK_PROFILE_ID)
    }

    static async requestPasswordRecovery({ email }: { email: string }) {
        const response = await axios.post("/api/auth/requestPasswordRecovery", {
            email
        })

        return response.data
    }

    static async updatePassword({ password }: { password: string }, { accessToken, refreshToken }: {
        accessToken: string,
        refreshToken: string
    }) {
        await axios.put("/api/auth/updatePassword", {
            password
        }, {
            headers: {
                "access-token": accessToken,
                "refresh-token": refreshToken
            }
        })
    }

    static async authenticateOauth(code: string) {
       const response = await axios.post("/api/auth/oauth", { code })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)
        localStorage.setItem(STK_PROFILE_ID, response?.data?.defaultProfile?.profile_id)

        identifyPendoVisitor({ userId: response.data.user.id })

        return response.data
    }

    static async generateGuestAccessToken(
        payload: {
            allowRecording?: boolean
            storyId?: string
            libraryId?: string
            organizationId?: number
        }
    ) {
        const headers = generateHeaders()

        const response = await axios.post("/api/auth/guest-access-token", payload, headers)

        return response.data
    }
}
