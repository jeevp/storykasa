import authMiddleware from "../../../middlewares/authMiddleware"
const StoryController = require("../../../service/controllers/StoryController")
const totalRecordingTime = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(404).send({ message: "API route not found" })
        return StoryController.getTotalRecordingTime(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(totalRecordingTime)
