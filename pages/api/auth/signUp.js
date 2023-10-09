import AuthController from "../../../service/controllers/AuthController"
const signUpHandler = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(404).send({ message: "API not found" })
        return AuthController.signUp(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default signUpHandler
