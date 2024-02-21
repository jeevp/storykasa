import adminAuthMiddleware from "../../../../../../middlewares/adminAuthMiddleware";
import BlogController from "../../.././../../../service/controllers/BlogController"

const blogPost = async (req, res) => {
    try {
        if (!["PUT", "DELETE"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "PUT") {
            return BlogController.updateBlogPost(req, res)
        }

        if (req.method === "DELETE") {
            return BlogController.deleteBlogPost(req, res)
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(blogPost)
