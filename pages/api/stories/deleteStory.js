import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController"
const deleteStory = async (req, res) => {
    try {
        if (req.method !== "DELETE") return res.status(404).send({ message: "API route not found" })
        return StoryController.deleteStory(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(deleteStory)
