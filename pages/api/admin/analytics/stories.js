import AnalyticsController from "../../../../service/controllers/AnalyticsController"
import adminAuthMiddleware from "../../../../middlewares/adminAuthMiddleware";


const storiesAnalytics = async (req, res) => {
    try {
        if (!["GET"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        return AnalyticsController.getStoriesAnalytics(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(storiesAnalytics)
