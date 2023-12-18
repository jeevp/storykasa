import authMiddleware from "../../../middlewares/authMiddleware";
import LibraryController from "../../../service/controllers/LibraryController"

const libraries = async (req, res) => {
    try {
        switch(req.method) {
            case "GET":
                return LibraryController.getLibraries(req, res)

            case "POST":
                return LibraryController.createLibrary(req, res)

            default:
                return res.status(404).send({ message: "API route not found." })
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(libraries)
