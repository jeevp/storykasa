import SubscriptionsController from "../../../service/controllers/SubscriptionsController"

const payments = async (req, res) => {
    try {
        switch(req.method) {
            case "PUT":
                return SubscriptionsController.updateSubscription(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default payments
