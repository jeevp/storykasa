import OrganizationsController from "../../../../service/controllers/OrganizationsController"
import adminAuthMiddleware from "../../../../middlewares/adminAuthMiddleware";

const organizations = async (req, res) => {
    try {
        if (!["POST", "GET"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "GET") return OrganizationsController.getOrganizations(req, res)

        if (req.method === "POST") return OrganizationsController.createOrganization(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(organizations)
