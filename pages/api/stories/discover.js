import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController"
const discover = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(404).send({ message: "API route not found" })
        return StoryController.getDiscoverStories(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(discover)
