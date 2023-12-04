const supabase = require("../supabase")
const HeardAboutResearch = require("../models/HeardAboutResearch")

class HeardAboutResearchController {
    static async create(req, res) {
        try {
            const {
                sources,
                otherSource
            } = req.body

            if (!sources && !otherSource) {
                return res.status(400).send({
                    message: "Payload is incorrect."
                })
            }
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            // Save terms of service
            await HeardAboutResearch.create({
                userId: user.id,
                sources,
                otherSource
            }, { accessToken: req.accessToken })


            return res.status(200).send({ message: "Heard about research created" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = HeardAboutResearchController
