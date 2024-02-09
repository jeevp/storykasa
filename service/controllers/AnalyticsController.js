const Account = require("../models/Account")
const Story = require("../models/Story")


class AnalyticsController {
    static async getAnalyticsOverview(req, res) {
        try {

            const accounts = await Account.findAll()
            const stories = await Story.findAll()

            let totalMinutesListened = 0
            let totalMinutesRecorded = 0
            let languages = new Set()
            stories.forEach((story) => {
                const minutesListened = story.playCount * (story.duration / 60)
                totalMinutesListened += minutesListened

                const minutesRecorded = story.duration / 60
                totalMinutesRecorded += minutesRecorded

                languages.add(story.language)
            })

            const analyticsOverview = {
                users: accounts?.length,
                totalMinutesListened: Math.ceil(totalMinutesListened),
                languages: languages.size,
                totalMinutesRecorded: Math.ceil(totalMinutesRecorded)
            }

            return res.status(200).send(analyticsOverview)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = AnalyticsController
