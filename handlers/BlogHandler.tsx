import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders"
import BlogPost from "@/models/BlogPost";


export default class BlogHandler {
    static async createBlogPost({ title, text }: { title: string, text: string }) {
        const headers = generateHeaders()
        const response = await axios.post("/api/admin/blog/posts", {
            title, text
        }, headers)

        return new BlogPost({ ...response.data })
    }

    static async fetchBlogPosts() {
        const headers = generateHeaders()
        const response = await axios.get("/api/admin/blog/posts", headers)

        return response.data.map((blogPost: any) => new BlogPost({ ...blogPost }))
    }

    static async updateBlogPost(
        { blogPostId }: { blogPostId: number },
        { title, text }: { title: string, text: string, published: boolean }
    ) {
        const headers = generateHeaders()
        const payload = {}
        // @ts-ignore
        if (title) payload.title = title
        // @ts-ignore
        if (text) payload.text = text

        const response = await axios.put(
            `/api/admin/blog/posts/${blogPostId}`,
            payload,
            headers
        )

        return new BlogPost({ ...response.data })
    }

    static async deleteBlogPost({ blogPostId }: { blogPostId: number }) {
        const headers = generateHeaders()

        const response = await axios.delete(
            `/api/admin/blog/posts/${blogPostId}`,
            headers
        )

        return response.data
    }

    static async updatePublication({ blogPostId }: { blogPostId: number }, { publish }: { publish: boolean }) {
        const headers = generateHeaders()

        const response = await axios.put(
            `/api/admin/blog/posts/${blogPostId}/publication`,
            { publish },
            headers
        )

        return response.data
    }
}
