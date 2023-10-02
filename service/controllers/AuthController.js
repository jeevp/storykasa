const supabase = require("../supabase")

class AuthController {
    static async signInWithPassword(req, res) {
        try {
            const { email, password } = req.body
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            await supabase.auth.setSession({
                refresh_token: data.session.refresh_token,
                access_token: data.session.access_token
            })

            return res.status(200).send(data)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}


module.exports = AuthController
