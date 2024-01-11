import authMiddleware from "../../../../middlewares/authMiddleware";
import PaymentsController from "../../../../service/controllers/PaymentsController";

const payments = async (req, res) => {
    try {
        switch(req.method) {
            case "PUT":
                return PaymentsController.attachPaymentMethod(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(payments)
