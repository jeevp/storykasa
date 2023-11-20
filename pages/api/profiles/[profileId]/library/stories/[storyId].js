import authMiddleware from "../../../../../../middlewares/authMiddleware";
import StoryController from "../../../../../../service/controllers/StoryController"

const profilesLibraryStory = async (req, res) => {
    try {
        if (!["DELETE", "POST"].includes(req.method)) return res.status(404).send({ message: "API route not found" })

        if (req.method === "DELETE") {
            return StoryController.removeStoryFromLibrary(req, res)
        }

        if (req.method === "POST") {
            return StoryController.addStoryToLibrary(req, res)
        }
    } catch (error) {
        console.error(error)
        res.status(400).send({ message: "Something went wrong" })
    }
}

export default authMiddleware(profilesLibraryStory)
