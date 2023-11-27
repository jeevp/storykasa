import PublicStoryRequestController from "../../../../../service/controllers/PublicStoryRequestController"
import authMiddleware from "../../../../../middlewares/authMiddleware";


const index = async (req, res) => {
    try {
        if (req.method !== "PUT") return res.status(404).send({ message: "API not found" })
        return PublicStoryRequestController.updatePublicStoryRequest(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default authMiddleware(index)
