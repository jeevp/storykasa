import authMiddleware from "../../../../../middlewares/authMiddleware";
import StoryController from "../../../../../service/controllers/StoryController"

const unfinishedStories = async (req, res) => {
    try {
        if (!["GET"].includes(req.method)) return res.status(404).send({ message: "API route not found" })

        return StoryController.getUnfinishedStories(req, res)
    } catch (error) {
        console.error(error)
        res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(unfinishedStories)
