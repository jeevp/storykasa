import axios from "axios"

export default class AuthHandler {
    static async signInWithPassword({ email, password }: { email: string, password: string }) {
        const response = await axios.post("/api/auth/signIn", {
            email,
            password
        })

        localStorage.setItem("STK_ACCESS_TOKEN", response?.data?.session?.access_token)

        return response.data
    }
}
