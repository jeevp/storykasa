import OrganizationsController from "../../../../../service/controllers/OrganizationsController"
import adminAuthMiddleware from "../../../../../middlewares/adminAuthMiddleware";

const organizations = async (req, res) => {
    try {
        if (!["PUT", "DELETE"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "PUT") return OrganizationsController.updateOrganization(req, res)

        if (req.method === "DELETE") return OrganizationsController.deleteOrganization(req, res)
    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(organizations)
