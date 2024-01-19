import WebhooksController from "../../../../service/controllers/WebhooksController";

const paymentFailed = async (req, res) => {
    try {
        switch(req.method) {
            case "POST":
                return WebhooksController.stripePaymentFailed(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default paymentFailed
