import authMiddleware from "../../../../../middlewares/authMiddleware";
import StoryController from "../../../../../service/controllers/StoryController"

const createStory = async (req, res) => {
    try {
        return StoryController.createStory(req, res)
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(createStory)

