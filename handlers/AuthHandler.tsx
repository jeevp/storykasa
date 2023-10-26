import axios from "axios"
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN, STK_PROFILE_ID } from "@/config"
import identifyPendoVisitor from "@/tools/Pendo/identifyPendoVisitor";

export default class AuthHandler {
    static async signUp({ email, password, fullName }: {
        email: string,
        password: string,
        fullName: string
    }) {
        const response = await axios.post("/api/auth/signUp", {
            email,
            password,
            fullName
        })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)

        identifyPendoVisitor({ userId: response.data.user.id })

        return response.data
    }

    static async signInWithPassword({ email, password }: { email: string, password: string }) {
        const response = await axios.post("/api/auth/signIn", {
            email,
            password
        })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)

        identifyPendoVisitor({ userId: response.data.user.id })

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
        await axios.post("/api/auth/oauth", { code })
    }
}
