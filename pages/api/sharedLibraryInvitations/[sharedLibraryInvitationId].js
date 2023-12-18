import authMiddleware from "../../../middlewares/authMiddleware";
import SharedLibraryInvitationController from "../../../service/controllers/SharedLibraryInvitationController"

const sharedLibraryInvitations = async (req, res) => {
    try {
        switch(req.method) {
            case "PUT":
                return SharedLibraryInvitationController.updateSharedLibraryInvitation(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(sharedLibraryInvitations)
