import authMiddleware from "../../../middlewares/authMiddleware";
import StorageController from "../../../service/controllers/StorageController"
import Busboy from 'busboy';

export const config = {
    api: {
        bodyParser: false,  // Disabling Next.js' automatic body parsing
    },
};



const uploadFile = async (req, res) => {
    try {
        return StorageController.uploadFile(req, res)
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}



export default authMiddleware(uploadFile)
