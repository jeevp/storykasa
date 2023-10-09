import authMiddleware from "../../../middlewares/authMiddleware";
import ProfileController from "../../../service/controllers/ProfileController"

const profiles = async (req, res) => {
    try {
        switch(req.method) {
            case "GET":
                return ProfileController.getProfiles(req, res)

            case "POST":
                return ProfileController.createProfile(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(profiles)
