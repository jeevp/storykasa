import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import BlogHandler from "@/handlers/BlogHandler";
import {useBlog} from "@/contexts/blog/BlogContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {useState} from "react";


interface DeleteBlogPostDialogProps {
    active: boolean
    blogPost: any
    onClose: () => void
}

export default function DeleteBlogPostDialog({ active, blogPost,  onClose = () => ({}) }: DeleteBlogPostDialogProps) {
    const [loading, setLoading] = useState(false)

    const { blogPosts, setBlogPosts } = useBlog()
    const { setSnackbarBus } = useSnackbar()

    // Methods
    const handleDeleteBlogPost = async () => {
        try {
            setLoading(true)
            await BlogHandler.deleteBlogPost({ blogPostId: blogPost.id })
            // @ts-ignore
            const _blogPosts = blogPosts.filter((_blogPost) => _blogPost.id !== blogPost.id)
            // @ts-ignore
            setBlogPosts(_blogPosts)

            setSnackbarBus({
                active: true,
                message: "Blog post deleted with success!",
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

    return (
        <InfoDialog
            active={active}
            title="Delete post"
            text="This action cannot be undone. Deleting this blog post will permanently remove it from the platform. Please confirm if you wish to proceed with deletion."
            confirmationButtonText="Delete"
            onClose={() => onClose()}
            loading={loading}
            onAction={handleDeleteBlogPost}/>
    )
}
