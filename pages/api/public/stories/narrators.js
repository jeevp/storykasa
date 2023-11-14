import authMiddleware from "../../../../middlewares/authMiddleware";
import StoryController from "../../../../service/controllers/StoryController"

const getPublicStoriesNarrators = async (req, res) => {
    try {
        return StoryController.getPublicStoriesNarrators(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(getPublicStoriesNarrators)
