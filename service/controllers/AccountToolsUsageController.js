const supabase = require("../supabase");
const AccountToolsUsage = require("../models/AccountToolsUsage")


class AccountToolsUsageController {
    static async getAccountToolsUsage(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            if (!user) {
                return res.status(400).send({ message: "Missing user" })
            }

            const accountToolsUsage = await AccountToolsUsage.findOne({
                accountId: user?.id
            })

            return res.status(200).send({
                currentMonthTotalStoryIdeas: accountToolsUsage.currentMonthTotalStoryIdeas
            })
        } catch {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}

module.exports = AccountToolsUsageController
