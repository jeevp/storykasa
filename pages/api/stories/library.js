import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController"

const library = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(404).send({ message: "API route not found" })
        return StoryController.getLibraryStories(req, res)
    } catch (error) {
        res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(library)
