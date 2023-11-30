import AuthController from "../../../service/controllers/AuthController"
const requestPasswordRecovery = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(404).send({ message: "API route not found" })
        return AuthController.requestPasswordRecovery(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}


export default requestPasswordRecovery
