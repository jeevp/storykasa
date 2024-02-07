import AnalyticsController from "../../../service/controllers/AnalyticsController"
import validateWebsiteAPIKeyMiddleware from "../../../middlewares/validateWebsiteAccessTokenMiddleware"


const analyticsOverview = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(404).send({ message: "API not found" })
        return AnalyticsController.getAnalyticsOverview(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default validateWebsiteAPIKeyMiddleware(analyticsOverview)
