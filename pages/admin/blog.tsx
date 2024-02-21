import PageWrapper from '@/composedComponents/PageWrapper'
import {useEffect, useState} from "react";
import STKButton from "@/components/STKButton/STKButton";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton"
import STKCard from "@/components/STKCard/STKCard"
import {useBlog} from "@/contexts/blog/BlogContext";
import useDevice from "@/customHooks/useDevice";
import CreateBlogPostDialog from "@/composedComponents/CreateBlogPostDialog/CreateBlogPostDialog";
import BlogHandler from "@/handlers/BlogHandler";
import STKMenu from "@/components/STKMenu/STKMenu";
import withProfile from "@/HOC/withProfile";
import withAdmin from "@/HOC/withAdmin";
import withAuth from "@/HOC/withAuth";
import UpdateBlogPostDialog from "@/composedComponents/UpdateBlogPostDialog/UpdateBlogPostDialog";
import DeleteBlogPostDialog from "@/composedComponents/DeleteBlogPostDialog/DeleteBlogPostDialog"
import BlogPostPublicationDialog from "@/composedComponents/BlogPostPublicationDialog/BlogPostPublicationDialog"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {green600, neutral800} from "@/assets/colorPallet/colors";
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
export const dynamic = 'force-dynamic'


const EDIT_BLOG_POST_MENU_OPTION = "EDIT_BLOG_POST_MENU_OPTION"
const DELETE_BLOG_POST_MENU_OPTION = "DELETE_BLOG_POST_MENU_OPTION"
const BLOG_POST_PUBLICATION_MENU_OPTION = "BLOG_POST_PUBLICATION_MENU_OPTION"


function Blog() {
    // States
    const [loading, setLoading] = useState(true)
    const [showCreateBlogPostDialog, setShowCreateBlogPostDialog] = useState(false)
    const [showEditBlogPostDialog, setShowEditBlogPostDialog] = useState(false)
    const [showDeleteBlogPostDialog, setShowDeleteBlogPostDialog] = useState(false)
    const [showPublishBlogPostDialog, setShowPublishBlogPostDialog] = useState(false)
    const [selectedBlogPost, setSelectedBlogPost] = useState(null)


    // Mounted
    useEffect(() => {
        handleFetchBlogPosts()
    }, []);
    // Hooks
    const { onMobile } = useDevice()

    // Contexts
    const { blogPosts, setBlogPosts } = useBlog()

    // Methods
    const handleFetchBlogPosts = async () => {
        setLoading(true)
        const _blogPosts = await BlogHandler.fetchBlogPosts()
        setBlogPosts(_blogPosts)
        setLoading(false)
    }

    const handleMenuOnChange = (menu: Object, blogPost: any) => {
        setSelectedBlogPost(blogPost)

        // @ts-ignore
        switch (menu?.value) {
            case EDIT_BLOG_POST_MENU_OPTION:
                setShowEditBlogPostDialog(true)
                break

            case DELETE_BLOG_POST_MENU_OPTION:
                setShowDeleteBlogPostDialog(true)

                break

            case BLOG_POST_PUBLICATION_MENU_OPTION:
                setShowPublishBlogPostDialog(true)
                break

            default:
                break
        }
    }

    return (
        <>
            <PageWrapper admin path="discover">
                <div className="pb-20">
                    {blogPosts.length === 0 && !loading ? (
                        <div className="bg-[#f5efdc] box-border flex flex-col items-center p-5 rounded-lg text-center w-full">
                            <p className="text-lg text-gray-800 font-semibold text-center max-w-[240px] lg:max-w-lg">
                                Empty Blog: Opportunity Awaits!
                            </p>
                            <p className="text-md text-gray-600 my-3 max-w-[240px] lg:max-w-xl">
                                The StoryKasa blog is currently empty, awaiting the insights and stories that only you can provide. Start crafting impactful posts today.
                            </p>
                            <div className="mt-8 flex flex-col lg:flex-row items-center">
                                <STKButton
                                fullWidth={onMobile}
                                onClick={() => setShowCreateBlogPostDialog(true)}>
                                    Create post
                                </STKButton>
                            </div>
                        </div>
                    ) : blogPosts.length > 0 && !loading ? (
                        <div>
                            <div className="flex items-center justify-between">
                                <h2 className="m-0">
                                    Blog
                                </h2>
                                <STKButton onClick={() => setShowCreateBlogPostDialog(true)}>
                                    Create post
                                </STKButton>
                            </div>
                            <div className="mt-10">
                                {blogPosts?.map((blogPost) => (
                                    <div
                                    className="mt-2 first:mt-0"
                                    // @ts-ignore
                                    key={blogPost?.id}>
                                        <STKCard>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <label className="text-lg font-semibold">
                                                            {
                                                                // @ts-ignore
                                                                blogPost?.title
                                                            }
                                                        </label>
                                                        {
                                                            // @ts-ignore
                                                            blogPost.published ? (
                                                            <div className="flex items-center ml-4">
                                                                <CheckCircleOutlineIcon sx={{ width: "18px", color: green600 }} />
                                                                <label className="ml-1 text-sm text-green-800">Published</label>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center ml-4">
                                                                <UnpublishedOutlinedIcon sx={{ width: "18px", color: neutral800 }} />
                                                                <label className="ml-1 text-sm text-neutral-800 ">Unpublished</label>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <STKMenu
                                                        options={[
                                                            { label: "Edit", value: EDIT_BLOG_POST_MENU_OPTION },
                                                            { label: "Delete", value: DELETE_BLOG_POST_MENU_OPTION },
                                                            // @ts-ignore
                                                            { label: blogPost?.published ? 'Unpublish' : 'Publish', value: BLOG_POST_PUBLICATION_MENU_OPTION }
                                                        ]}
                                                        onChange={(menuOption) => handleMenuOnChange(menuOption, blogPost)}/>
                                                </div>
                                                <p className="text-lg multiline-ellipsis">
                                                    {
                                                        // @ts-ignore
                                                        blogPost?.text
                                                    }
                                                </p>
                                            </div>
                                        </STKCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mt-10">
                                {[1,2,3]?.map((blogPost) => (
                                    <div className="mt-2 first:mt-0" key={blogPost}>
                                        <STKSkeleton width="100%" height="158px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </PageWrapper>
            <CreateBlogPostDialog
            open={showCreateBlogPostDialog}
            onClose={() => setShowCreateBlogPostDialog(false)}/>
            <UpdateBlogPostDialog
            open={showEditBlogPostDialog}
            blogPostToUpdate={selectedBlogPost}
            onClose={() => setShowEditBlogPostDialog(false)}/>
            <DeleteBlogPostDialog
            active={showDeleteBlogPostDialog}
            blogPost={selectedBlogPost}
            onClose={() => setShowDeleteBlogPostDialog(false)}/>
            <BlogPostPublicationDialog
            active={showPublishBlogPostDialog}
            blogPost={selectedBlogPost}
            onClose={() => setShowPublishBlogPostDialog(false)}/>
        </>
    )
}


export default withAuth(withProfile(withAdmin(Blog)))
