import axios from "axios"
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from "@/config"

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

        console.log({ response })
        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)

        return response.data
    }

    static async signInWithPassword({ email, password }: { email: string, password: string }) {
        const response = await axios.post("/api/auth/signIn", {
            email,
            password
        })

        localStorage.setItem(STK_ACCESS_TOKEN, response?.data?.session?.access_token)
        localStorage.setItem(STK_REFRESH_TOKEN, response?.data?.session?.refresh_token)

        return response.data
    }

    static async signOut() {
        await axios.post("/api/auth/signOut")
    }

    static async requestPasswordRecovery({ email }: { email: string }) {
        const response = await axios.post("/api/auth/passwordRecoveryRequest", {
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
}
