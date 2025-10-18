import authMiddleware from "../../../../middlewares/authMiddleware";
import StoryController from "../../../../service/controllers/StoryController"

const transcript = async (req, res) => {
    try {
        const allowedMethods = ["GET", "PUT"]
        if (!allowedMethods.includes(req.method)) {
            return res.status(404).send({ message: "API route not found" })
        }

        if (req.method === "GET") {
            return StoryController.getTranscript(req, res)
        }

        if (req.method === "PUT") {
            return StoryController.updateTranscript(req, res)
        }

    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(transcript)