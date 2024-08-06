import OrganizationsController from "../../../service/controllers/OrganizationsController"
import authMiddleware from "../../../middlewares/authMiddleware";

const organizations = async (req, res) => {
    try {
        if (!["GET"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        return OrganizationsController.getUserOrganizations(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default authMiddleware(organizations)
