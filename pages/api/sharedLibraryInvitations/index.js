import authMiddleware from "../../../middlewares/authMiddleware";
import LibraryController from "../../../service/controllers/LibraryController"
import SharedLibraryInvitationController from "../../../service/controllers/SharedLibraryInvitationController";

const sharedLibraries = async (req, res) => {
    try {
        switch(req.method) {
            case "GET":
                return SharedLibraryInvitationController.getSharedLibraryInvitations(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(sharedLibraries)
