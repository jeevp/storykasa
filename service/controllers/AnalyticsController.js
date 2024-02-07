const Account = require("../models/Account")

class AnalyticsController {
    static async getAnalyticsOverview(req, res) {
        try {

            const accounts = await Account.findAll()

            const analyticsOverview = {
                users: accounts?.length
            }

            return res.status(200).send(analyticsOverview)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = AnalyticsController
