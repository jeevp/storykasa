import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import STKTextField from "@/components/STKTextField/STKTextField"
import useDevice from "@/customHooks/useDevice";
import BlogHandler from "@/handlers/BlogHandler";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {useBlog} from "@/contexts/blog/BlogContext";


interface UpdateBlogPostDialogProps {
    open: boolean;
    blogPostToUpdate: any;
    onClose?: () => void;
}

export default function UpdateBlogPostDialog({
    open,
    blogPostToUpdate,
    onClose = () => ({}),
}: UpdateBlogPostDialogProps) {
    const { onMobile } = useDevice()

    // Contexts
    const { setSnackbarBus } = useSnackbar()
    const { blogPosts, setBlogPosts } = useBlog()

    // States
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {
        if (blogPostToUpdate) {
            setTitle(blogPostToUpdate.title)
            setText(blogPostToUpdate.text)
        }
    }, [blogPostToUpdate]);

    // Methods
    const handleBlogPostOnChange = (key: string, value: string) => {
        if (key === "title") setTitle(value)
        if (key === "text") setText(value)
    }

    const handleSaveBlogPost = async () => {
        try {
            setLoading(true)
            // @ts-ignore
            const _blogPost = await BlogHandler.updateBlogPost({ blogPostId: blogPostToUpdate.id }, {
                title,
                text
            })

            const _blogPosts = [...blogPosts].map((blogPost) => {
                // @ts-ignore
                if (blogPost.id === blogPostToUpdate.id) {
                    return _blogPost
                }

                return blogPost
            })

            // @ts-ignore
            setBlogPosts(_blogPosts)
            setSnackbarBus({
                active: true,
                message: "Blog post updated with success!",
                type: "success"
            })

            onClose()
        } catch (error) {
            setSnackbarBus({
                active: true,
                message: "Ops! Something went wrong",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    }


    return (
        <STKDialog
        active={open}
        maxWidth="lg"
        title="Update blog post"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <form>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Title</label>
                        <div className="mt-2 max-w-2xl">
                            <STKTextField
                            fluid
                            placeholder="Add blog title"
                            value={title}
                            onChange={(value) => handleBlogPostOnChange("title", value)}/>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Text</label>
                        <div className="mt-2">
                            <STKTextField
                            enableRichText
                            maxRows={100}
                            value={text}
                            fluid
                            multiline
                            placeholder="Add blog text"
                            onChange={(value) => handleBlogPostOnChange("text", value)}/>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    <div className="w-full lg:w-auto">
                        <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                          Cancel
                        </STKButton>
                    </div>
                    <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                          fullWidth={onMobile}
                          color="primary"
                          loading={loading}
                          onClick={handleSaveBlogPost}>
                          Save
                        </STKButton>
                    </div>
              </div>
            </form>
        </STKDialog>
    )
}
