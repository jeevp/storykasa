import { format } from 'timeago.js'
import { Baby, GlobeSimple, Timer, Heart } from '@phosphor-icons/react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Story, { languages } from '@/models/Story'
import STKCard from "@/components/STKCard/STKCard";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import {useEffect, useState} from "react";
import {green600} from "@/assets/colorPallet/colors";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import StoryHandler from "@/handlers/StoryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useStory} from "@/contexts/story/StoryContext";

export default function StoryCard({ story }: {
    story: Story
    selected: boolean
}) {
    const [liked, setLiked] = useState(false)
    const { currentProfileId } = useProfile()
    const { privateStories, setPrivateStories } = useStory()
    const { setSnackbarBus } = useSnackbar()

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


    return (
        <STKCard>
            <div className="p-4">
                <div className="flex">
                    <div className="flex justify-items-start">
                        <STKAvatar src={story?.profileAvatar!} name={story?.profileName} />
                    </div>
                    <div className="w-full cursor-pointer ml-4">
                        <div className="flex items-center justify-between w-full">
                            {story?.profileName && (
                                <label>
                                    {story?.profileName}
                                </label>
                            )}

                            <label className="text-xs">{format(story?.lastUpdated)}</label>
                        </div>

                        <label className="font-semibold text-lg">
                            {story?.title}
                        </label>

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
                            {story?.recordedBy && story.recordedBy !== currentProfileId && (
                                <div className="hidden lg:block">
                                    <STKButton iconButton onClick={handleLikedStories}>
                                        {liked ? <FavoriteIcon sx={{ fill: green600, width: "18px", height: "18px" }} /> : <FavoriteBorderIcon sx={{ fill: green600, width: "18px", height: "18px" }} />}
                                    </STKButton>
                                </div>
                            )}
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
                    {story?.recordedBy && story.recordedBy !== currentProfileId && (
                        <div className="block lg:hidden">
                            <STKButton iconButton onClick={handleLikedStories}>
                                {liked ? <FavoriteIcon sx={{ fill: green600, width: "18px", height: "18px" }} /> : <FavoriteBorderIcon sx={{ fill: green600, width: "18px", height: "18px" }} />}
                            </STKButton>
                        </div>
                    )}
                </div>

            </div>
        </STKCard>
    )
}
