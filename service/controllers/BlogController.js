const BlogPost = require("../models/BlogPost")
const APIValidator = require("../validators/APIValidator")
class BlogController {
    static async createBlogPost(req, res) {
        try {
            const { title, text } = req.body

            const blogPost = await BlogPost.create({ title, text })

            return res.status(201).send(blogPost)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getBlogPosts(req, res) {
        try {
            const blogPost = await BlogPost.findAll()

            return res.status(200).send(blogPost)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updateBlogPost(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["postId"]
            })

            const { title, text } = req.body
            const propertiesToBeUpdated = {}
            if (title) propertiesToBeUpdated.title = title
            if (text) propertiesToBeUpdated.text = text

            const blogPost = await BlogPost.findOne({ blogPostId: req.query.postId })

            if (!blogPost) {
                return res.status(404).send({ message: "Blog post not found" })
            }

            const _blogPost = await blogPost.update({ ...propertiesToBeUpdated })

            return res.status(202).send(_blogPost)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async deleteBlogPost(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["postId"]
            })

            const blogPost = await BlogPost.delete({ blogPostId: req.query.postId })

            return res.status(204).send(blogPost)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async applyPublication(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["postId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["publish"]
            })

            const blogPost = await BlogPost.findOne({ blogPostId: req.query.postId })

            if (!blogPost) {
                return res.status(404).send({ message: "Blog post not found" })
            }

            const { publish } = req.body

            if (publish) {
                await blogPost.publish()
            } else {
                await blogPost.unpublish()
            }

            return res.status(202).send({ message: "Blog post publication updated with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getPublishedBlogPosts(req, res) {
        try {
            const blogPosts = await BlogPost.findAll({ published: true })

            return res.status(200).send(blogPosts)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getPublishedBlogPost(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, { requiredParams: ["postId"] })

            const blogPost = await BlogPost.findOne({ blogPostId: req.query.postId })

            return res.status(200).send(blogPost)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = BlogController
