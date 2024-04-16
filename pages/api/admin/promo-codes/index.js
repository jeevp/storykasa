import PromoCodesController from "../../../../service/controllers/PromoCodesController"
import adminAuthMiddleware from "../../../../middlewares/adminAuthMiddleware";


const index = async (req, res) => {
    try {
        if (!["GET", "POST"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "POST"){
            return PromoCodesController.createPromoCode(req, res)
        }

        if (req.method === "GET") {
            return PromoCodesController.getPromoCodes(req, res)
        }
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(index)
