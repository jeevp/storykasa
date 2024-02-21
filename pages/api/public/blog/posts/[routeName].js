import BlogController from "../../.././../../service/controllers/BlogController"
import validateWebsiteAPIKeyMiddleware from "../../../../../middlewares/validateWebsiteAccessTokenMiddleware";

const blogPosts = async (req, res) => {
    try {
        if (!["GET"].includes(req.method)) return res.status(404).send({ message: "API not found" })

        if (req.method === "GET") {
            return BlogController.getPublishedBlogPost(req, res)
        }
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}

export default validateWebsiteAPIKeyMiddleware(blogPosts)
