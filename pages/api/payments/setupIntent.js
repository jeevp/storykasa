import SubscriptionsController from "../../../service/controllers/SubscriptionsController"
import authMiddleware from "../../../middlewares/authMiddleware";

const payments = async (req, res) => {
    try {
        switch(req.method) {
            case "POST":
                return SubscriptionsController.createSetupIntent(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(payments)
