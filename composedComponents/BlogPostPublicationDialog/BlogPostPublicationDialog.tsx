import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import BlogHandler from "@/handlers/BlogHandler";
import {useBlog} from "@/contexts/blog/BlogContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {useState} from "react";


interface BlogPostPublicationDialogProps {
    active: boolean
    blogPost: any
    onClose: () => void
}

export default function BlogPostPublicationDialog({ active, blogPost,  onClose = () => ({}) }: BlogPostPublicationDialogProps) {
    const [loading, setLoading] = useState(false)

    const { blogPosts, setBlogPosts } = useBlog()
    const { setSnackbarBus } = useSnackbar()

    // Methods
    const handleBlogPostPublication= async () => {
        try {
            setLoading(true)
            await BlogHandler.updatePublication(
                { blogPostId: blogPost.id },
                { publish: !blogPost.published }
            )

            const _blogPosts = blogPosts.map((_blogPost) => {
                // @ts-ignore
                if (_blogPost.id === blogPost.id) {
                    return {
                        // @ts-ignore
                        ..._blogPost,
                        published: !blogPost.published
                    }
                }

                return _blogPost
            })

            // @ts-ignore
            setBlogPosts(_blogPosts)

            setSnackbarBus({
                active: true,
                message: blogPost.published ? "Blog post unpublished with success!" : "Blog post published with success!",
                type: "success"
            })

            onClose()
        } catch (error) {
            setSnackbarBus({
                active: true,
                message: "Ops! Something went wrong.",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    }

    let text = "Publishing this post will make it visible to website's blog. Do you wish to proceed with publishing?"
    let title = "Publish blog post"
    let buttonText = "Publish"
    if (blogPost?.published) {
        text = "Unpublishing will remove it from the website's blog. Any shared links to this post will also become inactive. You can always republish it later if you change your mind. Do you want to continue with unpublishing the post?"
        title = "Unpublish blog post"
        buttonText = "Unpublish"
    }


    return (
        <InfoDialog
            active={active}
            title={title}
            text={text}
            confirmationButtonText={buttonText}
            onClose={() => onClose()}
            loading={loading}
            onAction={handleBlogPostPublication}/>
    )
}
