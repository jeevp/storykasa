import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController"

const deleteStory = async (req, res) => {
    try {
        const allowedMethods = ["DELETE", "PUT"]
        if (!allowedMethods.includes(req.method)) {
            return res.status(404).send({ message: "API route not found" })
        }

        if (req.method === "DELETE") {
            return StoryController.deleteStory(req, res)
        }

        if (req.method === "PUT") {
            return StoryController.updateStory(req, res)
        }

    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(deleteStory)
