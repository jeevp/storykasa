import authMiddleware from "../../../../middlewares/authMiddleware";
import StoryController from "../../../../service/controllers/StoryController"

const transcript = async (req, res) => {
    try {
        const allowedMethods = ["GET"]
        if (!allowedMethods.includes(req.method)) {
            return res.status(404).send({ message: "API route not found" })
        }

        return StoryController.getTranscript(req, res)

    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(transcript)