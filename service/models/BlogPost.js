const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const Formatter = require("../../utils/Formatter").default;

class BlogPost {
    constructor({
        id,
        createdAt,
        title,
        text,
        published,
        routeName
    }) {
        this.id = id
        this.createdAt = createdAt
        this.title = title
        this.text = text
        this.published = published
        this.routeName = routeName
    }

    static async create({ title, text }) {
        const routeName = Formatter.slugify(title)

        const response = await axios.post(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            { title, text, route_name: routeName },
            {
                params: {
                    select: '*'
                },
                headers: generateSupabaseHeaders()
            }
        )

        return new BlogPost({
            id: response.data[0].id,
            createdAt: response.data[0].created_at,
            title: response.data[0].title,
            text: response.data[0].text,
            published: response.data[0].published,
            routeName: response.data[0].route_name
        })
    }

    static async findAll(params = { published: undefined }) {
        const requestParams = { select: "*" }
        if (params.published === true || params.published === false) requestParams.published = `eq.${params.published}`

        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            {
                params: requestParams,
                headers: generateSupabaseHeaders()
            }
        )

        return response.data.map((blogPost) => new BlogPost({
            id: blogPost.id,
            createdAt: blogPost.created_at,
            title: blogPost.title,
            text: blogPost.text,
            published: blogPost.published,
            routeName: blogPost.route_name
        }))
    }

    async update({ title, text, published = undefined }) {
        const payload = {}
        if (title) {
            payload.title = title
            payload.route_name = Formatter.slugify(title)
        }
        if (text) payload.text = text
        if (published === true || published === false) {
            payload.published = published
        }

        const response = await axios.patch(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            payload,
            {
                params: {
                    select: '*',
                    id: `eq.${this.id}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        return new BlogPost({
            id: response.data[0].id,
            createdAt: response.data[0].created_at,
            title: response.data[0].title,
            text: response.data[0].text,
            published: response.data[0].published,
            routeName: response.data[0].route_name
        })
    }

    static async delete({ blogPostId }) {
        const response = await axios.delete(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            {
                params: {
                    select: '*',
                    id: `eq.${blogPostId}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        return response.data
    }

    static async findOne({ blogPostId }) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            {
                params: {
                    select: '*',
                    id: `eq.${blogPostId}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        return new BlogPost({
            id: response.data[0].id,
            createdAt: response.data[0].created_at,
            title: response.data[0].title,
            text: response.data[0].text,
            published: response.data[0].published,
            routeName: response.data[0].route_name
        })
    }

    async publish() {
        await this.update({  published: true })
    }

    async unpublish() {
        await this.update({ published: false })
    }
}

module.exports = BlogPost
