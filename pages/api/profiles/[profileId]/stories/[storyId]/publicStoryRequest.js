import authMiddleware from "../../../../../../middlewares/authMiddleware";
import StoryController from "../../../../../../service/controllers/StoryController"

const privateStoryToPublicLibrary = async (req, res) => {
    try {
        return StoryController.submitStoryToPublicLibrary(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(privateStoryToPublicLibrary)
