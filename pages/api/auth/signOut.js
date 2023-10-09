import AuthController from "../../../service/controllers/AuthController"
const signOutHandler = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(404).send({ message: "API not found" })
        return AuthController.signOut(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default signOutHandler
