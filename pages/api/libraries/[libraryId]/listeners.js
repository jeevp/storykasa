import authMiddleware from "../../../../middlewares/authMiddleware";
import LibraryController from "../../../../service/controllers/LibraryController"
import SharedLibraryInvitationController from "../../../../service/controllers/SharedLibraryInvitationController";

const listeners = async (req, res) => {
    try {
        switch(req.method) {
            case "POST":
                return SharedLibraryInvitationController.createSharedLibraryInvitations(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(listeners)
