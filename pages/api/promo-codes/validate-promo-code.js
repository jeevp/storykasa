import authMiddleware from "../../../middlewares/authMiddleware";
import PromoCodesController from "../../../service/controllers/PromoCodesController";

const promoCodes = async (req, res) => {
    try {
        switch(req.method) {
            case "POST":
                return PromoCodesController.validatePromoCode(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(promoCodes)
