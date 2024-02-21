import adminAuthMiddleware from "../../../../../middlewares/adminAuthMiddleware";
import BlogController from "../../.././../../service/controllers/BlogController"

const blogPosts = async (req, res) => {
    try {
        if (!["GET", "POST"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "POST") {
            return BlogController.createBlogPost(req, res)
        }

        if (req.method === "GET") {
            return BlogController.getBlogPosts(req, res)
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default adminAuthMiddleware(blogPosts)
