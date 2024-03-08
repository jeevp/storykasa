import authMiddleware from "../../../../../middlewares/authMiddleware";
import uploadMiddleware from "../../../../../middlewares/uploadMiddleware";
import StoryController from "../../../../../service/controllers/StoryController"

export const config = {
    api: {
        bodyParser: false
    },
};

const createStory = async (req, res) => {
    try {
        await uploadMiddleware(req, res)
        return StoryController.createStory(req, res)
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(createStory)

