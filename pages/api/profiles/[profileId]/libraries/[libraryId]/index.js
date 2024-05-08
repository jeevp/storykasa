import authMiddleware from "../../../../../../middlewares/authMiddleware";
import LibraryController from "../../../../../../service/controllers/LibraryController"

const index = async (req, res) => {
    try {
        switch(req.method) {
            case "DELETE":
                return LibraryController.deleteLibrary(req, res)

            case "PUT":
                return LibraryController.updateLibrary(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(index)
