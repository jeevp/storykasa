import { format } from 'timeago.js'
import { Baby, GlobeSimple, Timer } from '@phosphor-icons/react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Story from '@/models/Story'
import STKCard from "@/components/STKCard/STKCard";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import {useEffect, useState} from "react";
import {green600} from "@/assets/colorPallet/colors";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import StoryHandler from "@/handlers/StoryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useStory} from "@/contexts/story/StoryContext";
import STKMenu from "@/components/STKMenu/STKMenu";
import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import PublicIcon from '@mui/icons-material/Public';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import STKTooltip from "@/components/STKTooltip/STKTooltip";
import AddStoryToCollectionDialog from "@/composedComponents/AddStoryToCollectionDialog/AddStoryToCollectionDialog";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useRouter} from "next/router";
import {useLibrary} from "@/contexts/library/LibraryContext";
import UpdateStoryDialog from "@/composedComponents/UpdateStoryDialog/UpdateStoryDialog";
import DeleteStoryDialog from "@/composedComponents/DeleteStoryDialog/DeleteStoryDialog";


export const SUBMIT_TO_PUBLIC_LIBRARY_MENU_OPTION = "SUBMIT_TO_PUBLIC_LIBRARY_MENU_OPTION"
export const ADD_TO_LIBRARY_MENU_OPTION = "ADD_TO_LIBRARY_MENU_OPTION"
export const REMOVE_FROM_COLLECTION_MENU_OPTION = "REMOVE_FROM_COLLECTION_MENU_OPTION"
export const EDIT_STORY_MENU_OPTION = "EDIT_STORY_MENU_OPTION"
export const DELETE_STORY_MENU_OPTION = "DELETE_STORY_MENU_OPTION"

export default function StoryCard({
    story,
    enableMenuOptions,
    menuOptions = [],
    includeSoundTrack,
    disableLike,
    onClick = () => ({})
}: {
    story: Story
    selected?: boolean,
    enableMenuOptions?: boolean
    disableLike?: boolean
    includeSoundTrack?: boolean
    menuOptions?: any[]
    onClick?: () => void
}) {
    const router = useRouter()

    // States
    const [showUpdateStoryDialog, setShowUpdateStoryDialog] = useState(false)
    const [showDeleteStoryDialog, setShowDeleteStoryDialog] = useState(false)
    const [removeStoryLoading, setRemoveStoryLoading] = useState(false)
    const [showAddStoryToLibraryDialog, setShowAddStoryToLibraryDialog] = useState(false)
    const [loadingRequest, setLoadingRequest] = useState(false)
    const [publicStoryRequestSent, setPublicStoryRequestSent] = useState(false)
    const [showRemoveFromCollectionDialog, setShowRemoveFromCollectionDialog] = useState(false)
    const [liked, setLiked] = useState(false)
    const [showSubmitStoryToPublicLibraryInfoDialog, setShowSubmitStoryToPublicLibraryInfoDialog] = useState(false)
    const [infoDialogContent, setInfoDialogContent] = useState({
        title: "Submit your story to our public library!",
        text: `We're thrilled that you're considering sharing your story with our community. Your unique voice and 
        narrative are what make our library a vibrant and diverse place.`
    })

    // Contexts
    const { currentProfileId } = useProfile()
    const { privateStories, setPrivateStories } = useStory()
    const { setSnackbarBus } = useSnackbar()
    const { currentLibraryStories, setCurrentLibraryStories } = useLibrary()

    useEffect(() => {
        if (story?.recordedBy) {
            // @ts-ignore
            const storyHasBeenAddedToLibrary = privateStories.find((_story) => _story?.storyId === story.storyId)
            setLiked(Boolean(storyHasBeenAddedToLibrary))
        }
    }, [story]);

    const handleLikedStories = async (e: any) => {
        e.stopPropagation()
        setLiked(!liked)

        const _liked = !liked
        setLiked(_liked)

        try {
            let _privateStories = [...privateStories]

            if (_liked) {
                // @ts-ignore
                _privateStories.push(story)

                // @ts-ignore
                setPrivateStories(_privateStories)

                await StoryHandler.addStoryToLibrary({
                    storyId: story.storyId,
                    profileId: currentProfileId
                })
            } else {
                _privateStories = privateStories.filter((_story) => {
                    // @ts-ignore
                    return _story.storyId !== story.storyId
                })

                // @ts-ignore
                setPrivateStories(_privateStories)

                await StoryHandler.removeStoryFromLibrary({
                    storyId: story.storyId,
                    profileId: currentProfileId
                })
            }

            setSnackbarBus({
                type: "success",
                message: !liked ? "Added to library" : "Removed from library",
                active: true
            })
        } catch (error) {
            setSnackbarBus({
                type: "error",
                message: "Oops, something went wrong!",
                active: true
            })
        }
    }

    const handleSubmitStoryToPublicLibrary = async () => {
        if (story?.publicStoryRequestProcessing || story?.publicStoryRequestRefused) {
            let title = "Request is processing"
            let text = "You have already submitted a request to add this story to the public library. "

            if (story?.publicStoryRequestRefused) {
                title = "Request not approved"
                text = "Sorry, but this time we could not accept your story to be part of the public library."
            }

            setInfoDialogContent({ title, text})

            return
        }


        setLoadingRequest(true)

        const response = await StoryHandler.submitToPublicLibrary({
            storyId: story.storyId,
            profileId: currentProfileId
        })

        if (response.status === 201) {
            setInfoDialogContent({
                title: "Thank you for sharing your story!",
                text: `We will review it and get back to you within 24 hours. Please note that 
                only a small number of user submitted stories are included in the public library`
            })
        }

        setLoadingRequest(false)
        setPublicStoryRequestSent(true)
    }

    const handleMenuOnChange = (menu: Object) => {
        // @ts-ignore
        switch(menu?.value) {
            case SUBMIT_TO_PUBLIC_LIBRARY_MENU_OPTION:
                setShowSubmitStoryToPublicLibraryInfoDialog(true)
                break

            case ADD_TO_LIBRARY_MENU_OPTION:
                setShowAddStoryToLibraryDialog(true)
                break

            case REMOVE_FROM_COLLECTION_MENU_OPTION:
                setShowRemoveFromCollectionDialog(true)
                break

            case EDIT_STORY_MENU_OPTION:
                setShowUpdateStoryDialog(true)
                break

            case DELETE_STORY_MENU_OPTION:
                setShowDeleteStoryDialog(true)
                break

            default:
                break
        }
    }

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation()
        onClick()
    }

    const handleRemoveStoryFromCollection = async () => {
        setRemoveStoryLoading(true)
        await LibraryHandler.removeStory({
            storyId: story.storyId,
            libraryId: String(router.query.libraryId),
            profileId: currentProfileId
        })


        const _currentLibraryStories = currentLibraryStories.filter((_story) => {
            // @ts-ignore
            return _story?.storyId !== story.storyId
        })

        // @ts-ignore
        setCurrentLibraryStories(_currentLibraryStories)
        setRemoveStoryLoading(false)
        setShowRemoveFromCollectionDialog(false)
        setSnackbarBus({
            type: "success",
            message: "Story removed from collection with success",
            active: true
        })
    }


    return (
        <>
            <InfoDialog
                active={showSubmitStoryToPublicLibraryInfoDialog}
                title={infoDialogContent.title}
                text={infoDialogContent.text}
                loading={loadingRequest}
                onAction={handleSubmitStoryToPublicLibrary}
                confirmationButtonText={publicStoryRequestSent ? "" : "Submit to public library"}
                onClose={() => setShowSubmitStoryToPublicLibraryInfoDialog(false)} />
            {enableMenuOptions && (
                <AddStoryToCollectionDialog
                    open={showAddStoryToLibraryDialog}
                    story={story}
                    onClose={() => setShowAddStoryToLibraryDialog(false)}/>
            )}
            <div
            // @ts-ignore
            onClick={handleClick}>
                <STKCard>
                <div className="p-4">
                    <div className="flex">
                        <div className="flex justify-items-start">
                            <STKAvatar
                                src={story?.narratorName ? '' : story?.profileAvatar}
                                name={story?.narratorName || story?.profileName} />
                        </div>
                        <div className="w-full cursor-pointer ml-4">
                            <div className="flex items-center justify-between w-full">
                                <label>
                                    {story?.narratorName || story?.profileName}
                                </label>
                                <label className="text-xs">{format(story?.lastUpdated)}</label>
                            </div>

                            <label className="font-semibold text-lg">
                                {story?.title}
                            </label>
                            {story?.publicStoryRequestApproved && (
                                <div className="flex items-center mt-2 bg-green-50 p-2 w-28 justify-center rounded-2xl">
                                    <PublicIcon sx={{ fill: green600, width: "14px", height: "14px" }} />
                                    <label className="ml-2 text-sm">Public story</label>
                                </div>
                            )}

                            {story?.publicStoryRequestProcessing || publicStoryRequestSent ? (
                                <div className="flex items-center mt-2 bg-orange-50 p-2 w-36 justify-center rounded-2xl">
                                    <PendingOutlinedIcon sx={{ width: "14px", height: "14px" }} />
                                    <label className="ml-2 text-sm">Pending approval</label>
                                </div>
                            ) : null}

                            {story?.publicStoryRequestRefused && (
                                <>
                                    {story?.publicStoryRequest?.moderatorComment ? (
                                        <STKTooltip text={story?.publicStoryRequest?.moderatorComment} position="right">
                                            <div className="flex items-center mt-2 bg-red-50 p-2 w-36 justify-center rounded-2xl">
                                                <InfoOutlinedIcon sx={{ width: "14px", height: "14px" }} />
                                                <label className="ml-2 text-sm cursor-pointer">Publish declined</label>
                                            </div>
                                        </STKTooltip>
                                    ) : (
                                        <div className="flex items-center mt-2 bg-red-50 p-2 w-32 justify-center rounded-2xl">
                                            <label className="text-sm">Publish declined</label>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="flex justify-between">
                                <div className="lg:flex hidden items-center flex-wrap opacity-60 mt-4 pr-14">
                                    {story?.duration && (
                                        <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                            <Timer size={14} weight="bold" />
                                            <label className="ml-1">
                                                {Math.ceil(story?.duration / 60)} min
                                            </label>
                                        </div>
                                    )}
                                    {story?.ageGroups && (
                                        <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                            <Baby size={14} weight="bold" />
                                            <label className="ml-1">
                                                {story?.ageGroupsShortLabel}
                                            </label>
                                        </div>
                                    )}
                                    {story?.language && (
                                        <div className="flex items-center">
                                            <GlobeSimple size={14} weight="bold" />
                                            <label className="ml-1">
                                                {story?.language}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="items-end hidden lg:block">
                                    {!story?.recordingUrl ? (
                                        <div className="inline-flex py-2 px-3 bg-[#eaf8b2] rounded-2xl ml-2">
                                            <label className="font-semibold text-xs">Premium</label>
                                        </div>
                                    ) : (
                                      <>
                                          {story?.recordedBy && story.recordedBy !== currentProfileId && !disableLike && (
                                              <div>
                                                  <STKButton iconButton onClick={handleLikedStories}>
                                                      {liked ? <FavoriteIcon sx={{ fill: green600, width: "22px", height: "22px" }} /> : <FavoriteBorderIcon sx={{ fill: green600, width: "22px", height: "22px" }} />}
                                                  </STKButton>
                                              </div>
                                          )}
                                          {!enableMenuOptions ? (
                                              <></>
                                          ) : (
                                              <div>
                                                  {story?.recordedBy && story.recordedBy === currentProfileId && enableMenuOptions ? (
                                                      <div>
                                                          <STKMenu
                                                              options={menuOptions}
                                                              onChange={handleMenuOnChange}/>
                                                      </div>
                                                  ) : (
                                                      <div>
                                                          <STKMenu
                                                              options={menuOptions}
                                                              onChange={handleMenuOnChange}/>
                                                      </div>
                                                  )}
                                              </div>
                                          )}
                                      </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:hidden flex items-end justify-between mt-4">
                        <div className="flex items-center flex-wrap opacity-60 pr-14">
                            {story?.duration && (
                                <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                    <Timer size={14} weight="bold" />
                                    <label className="ml-1">
                                        {Math.ceil(story?.duration / 60)} min
                                    </label>
                                </div>
                            )}
                            {story?.ageGroups && (
                                <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                    <Baby size={14} weight="bold" />
                                    <label className="ml-1">
                                        {story?.ageGroupsShortLabel}
                                    </label>
                                </div>
                            )}
                            {story?.language && (
                                <div className="flex items-center">
                                    <GlobeSimple size={14} weight="bold" />
                                    <label className="ml-1">
                                        {story?.language}
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center lg:hidden">
                            {!story.recordingUrl ? (
                                <div className="inline-flex py-2 px-3 bg-[#eaf8b2] rounded-2xl ml-2">
                                    <label className="font-semibold text-xs">Premium</label>
                                </div>
                            ) : (
                                <>
                                    {story?.recordedBy && story.recordedBy !== currentProfileId && (
                                        <div className="block">
                                            <STKButton iconButton onClick={handleLikedStories}>
                                                {liked ? <FavoriteIcon sx={{ fill: green600, width: "22px", height: "22px" }} /> : <FavoriteBorderIcon sx={{ fill: green600, width: "22px", height: "22px" }} />}
                                            </STKButton>
                                        </div>
                                    )}
                                    {story?.recordedBy && story.recordedBy === currentProfileId && enableMenuOptions ? (
                                        <div className="block">
                                            <STKMenu
                                                options={menuOptions}
                                                onChange={handleMenuOnChange}/>
                                        </div>
                                    ): (
                                        <div>
                                            <STKMenu
                                                options={[
                                                    {
                                                        label: "Add to collection",
                                                        value: ADD_TO_LIBRARY_MENU_OPTION
                                                    }
                                                ]}
                                                onChange={handleMenuOnChange}/>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </STKCard>
            </div>
            <InfoDialog
            active={showRemoveFromCollectionDialog}
            text={`Confirm the action bellow to remove ${story.title} story from this collection`}
            title="Remove story from collection"
            loading={removeStoryLoading}
            onAction={handleRemoveStoryFromCollection}
            confirmationButtonText="Remove story"
            onClose={() => setShowRemoveFromCollectionDialog(false)}/>
            <UpdateStoryDialog
            open={showUpdateStoryDialog}
            story={story}
            onClose={() => setShowUpdateStoryDialog(false)} />
            <DeleteStoryDialog
            open={showDeleteStoryDialog}
            story={story}
            onClose={() => setShowDeleteStoryDialog(false)} />
        </>
    )
}
