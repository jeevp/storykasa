import authMiddleware from "../../../middlewares/authMiddleware";
import ProfileController from "../../../service/controllers/ProfileController"

const updateProfile = async (req, res) => {
    try {
        if (req.method !== "PUT") return res.status(404).send({ message: "API route not found" })
        return ProfileController.updateProfile(req, res)
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(updateProfile)
