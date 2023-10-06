const supabase = require("../supabase")

class AuthController {
    static async signUp(req, res) {
        try {
            const { email, password, fullName } = req.body

            if (!email || !password || !fullName) {
                return res.status(400).send({
                    message: "Payload is incorrect."
                })
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    },
                },
            })

            await supabase.auth.setSession({
                refresh_token: data.session.refresh_token,
                access_token: data.session.access_token
            })

            return res.status(200).send(data)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async signInWithPassword(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).send({
                    message: "Payload is incorrect."
                })
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            await supabase.auth.signOut()
            await supabase.auth.setSession({
                refresh_token: data.session.refresh_token,
                access_token: data.session.access_token
            })

            return res.status(200).send(data)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async signOut(req, res) {
        try {
            await supabase.auth.signOut()

            return res.status(201).send({ message: "Session has been finished with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async requestPasswordRecovery(req, res) {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(400).send({ message: "Payload is incorrect." })
            }

            const redirectToURL = `${process.env.NEXT_PUBLIC_ORIGIN}/update-password`

            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectToURL
            })

            return res.status(201).send({ message: "Password recovery requested with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async updatePassword(req, res) {
        try {
            const { password } = req.body

            if (!password) {
                return res.status(400).send({ message: "Payload is incorrect." })
            }

            await supabase.auth.setSession({
                refresh_token: req.refreshToken,
                access_token: req.accessToken
            })

            await supabase.auth.updateUser({ password })

            return res.status(200).send({ message: "Password updated with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = AuthController
