import AuthController from "../../../service/controllers/AuthController"
import authMiddleware from "../../../middlewares/authMiddleware";
const guestAccessTokenHandler = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(404).send({ message: "API not found" })
        return AuthController.generateGuestAccessToken(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default authMiddleware(guestAccessTokenHandler)
