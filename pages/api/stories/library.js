import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController"

const library = async (req, res) => {
    try {
        if (!["GET", "POST"].includes(req.method)) return res.status(404).send({ message: "API route not found" })

        if (req.method === "GET") {
            return StoryController.getLibraryStories(req, res)
        }

        if (req.method === "POST") {
            return StoryController.addStoryToLibrary(req, res)
        }
    } catch (error) {
        res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(library)
