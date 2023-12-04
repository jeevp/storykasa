import HeardAboutResearchController from "../../service/controllers/HeardAboutResearchController"
import authMiddleware from "../../middlewares/authMiddleware";


const HeardAboutResearch = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(404).send({ message: "API not found" })
        return HeardAboutResearchController.create(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default authMiddleware(HeardAboutResearch)
