const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class BlogPost {
    constructor({
        id,
        createdAt,
        title,
        text,
        published
    }) {
        this.id = id
        this.createdAt = createdAt
        this.title = title
        this.text = text
        this.published = published
    }

    static async create({ title, text }) {
        const response = await axios.post(
            `${process.env.SUPABASE_URL}/rest/v1/blog_posts`,
            { title, text },
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
            published: response.data[0].published
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
            published: blogPost.published
        }))
    }

    async update({ title, text, published = undefined }) {
        const payload = {}
        if (title) payload.title = title
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
            published: response.data[0].published
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
            published: response.data[0].published
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
