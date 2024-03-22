import authMiddleware from "../../../middlewares/authMiddleware";
import AccountToolsUsageController from "../../../service/controllers/AccountToolsUsageController"

const accountToolsUsage = async (req, res) => {
    try {
        if (req.method !== "GET") return res.status(400).send({ message: "Not exist" })

        return AccountToolsUsageController.getAccountToolsUsage(req, res)
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong" })
    }
}


export default authMiddleware(accountToolsUsage)
