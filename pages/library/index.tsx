import StoryCard, {
    ADD_TO_LIBRARY_MENU_OPTION,
    SUBMIT_TO_PUBLIC_LIBRARY_MENU_OPTION,
    DELETE_STORY_MENU_OPTION,
    EDIT_STORY_MENU_OPTION
} from '@/composedComponents/StoryCard/StoryCard'
import { useEffect, useState} from 'react'
import StoryDetails from '@/composedComponents/StoryDetails/StoryDetails'
import PageWrapper from '@/composedComponents/PageWrapper'
import {AnimatePresence, motion} from 'framer-motion'
import {MagnifyingGlass, SmileyMeh} from '@phosphor-icons/react'
import useDevice from "@/customHooks/useDevice";
import StoryDetailsDialog from "@/composedComponents/StoryDetailsDialog/StoryDetailsDialog";
import STKTooltip from "@/composedComponents/STKTooltip/STKTooltip";
import STKTextField from "@/components/STKTextField/STKTextField";
import Link from "next/link";
import StoryHandler from "@/handlers/StoryHandler";
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import Story from "@/models/Story";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import StoryFilters from "@/composedComponents/StoryFilters/StoryFilters";
import {Divider} from "@mui/material";
import {useStory} from "@/contexts/story/StoryContext";
import StoryFiltersSummary from "@/composedComponents/StoryFilters/StoryFiltersSummary/StoryFiltersSummary";
import {neutral300} from "@/assets/colorPallet/colors";
import {useProfile} from "@/contexts/profile/ProfileContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";

function Library() {
    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [selectedStory, setSelectedStory] = useState<Story | undefined>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [stories, setStories] = useState([])

    // Contexts
    const { privateStories, setPrivateStories, storyFilters } = useStory()
    const { currentProfileId } = useProfile()
    const { setLibraries } = useLibrary()

    // Mounted
    useEffect(() => {
        handleFetchLibraries()
    }, []);

    useEffect(() => {
        if (privateStories) {
            setStories([...privateStories])

            if (selectedStory) {
                const _selectedStory = privateStories.find((privateStory: Story) => {
                    return privateStory.storyId === selectedStory?.storyId
                })

                setSelectedStory(_selectedStory)
            }
        }
    }, [privateStories]);

    // Methods
    const handleFetchLibraries = async () => {
        await LibraryHandler.fetchLibraries(setLibraries)
    }

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
        const filteredStories = privateStories.filter((story: Story) => {
            return story?.title?.toLowerCase()?.includes(value.toLowerCase())
        })

        setStories(filteredStories)
    }

    const loadStories = async () => {
        const allStories: Story[] = await StoryHandler.fetchPrivateStories({}, {
            profileId: currentProfileId
        })

        // @ts-ignore
        setPrivateStories(allStories)
        // @ts-ignore
        setStories(allStories)
        setLoaded(true)
    }

    const handleStoryClick = (story: Story) => {
        setSelectedStory(story)
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    const disableSearchAndFilters = () => {
        return (
            privateStories?.length === 0
            && Object.keys(storyFilters).length === 0
        )
    }

    useEffect(() => {
        loadStories()
    }, [])


    return (
        <PageWrapper path="library">
            <div>
                <div className="flex items-center">
                    <h2 className="m-0 text-2xl">
                        My story library
                        <span>
                        <STKTooltip title="Stories in your library are private to your account, but can be accessed from any of your profiles.">

                        </STKTooltip>
                    </span>
                    </h2>
                </div>
                <div className="mt-4 w-full">
                    {!loaded ? (
                        <div className="mb-10">
                            <STKSkeleton width={onMobile ? '300px' : '500px'} height="20px" />
                            <div className="mt-1">
                                <STKSkeleton width={onMobile ? '200px' : '300px'} height="20px" />
                            </div>
                        </div>
                    ) : (
                     <>
                         {privateStories.length || (privateStories.length === 0 && Object.keys(storyFilters).length > 0) ? (
                             <p>
                                 This is the home for the index you save or record.
                             </p>
                         ) : privateStories.length === 0 && Object.keys(storyFilters).length === 0 ? (
                             <div className="bg-[#f5efdc] box-border flex flex-col items-center p-5 rounded-lg text-center w-full">
                                 <p className="text-lg text-gray-800 font-semibold text-center max-w-[240px] lg:max-w-lg">
                                     {/* eslint-disable-next-line react/no-unescaped-entities */}
                                     Your library is empty, but it doesn't have to be!
                                 </p>
                                 <p className="text-md text-gray-600 my-3 max-w-[240px] lg:max-w-lg">
                                     Discover the joy of storytelling in two exciting ways:
                                 </p>
                                 <div className="mt-8 flex flex-col lg:flex-row items-center">
                                     <Link href="/record" className="w-full lg:w-auto">
                                         <STKButton fullWidth={onMobile}>Create your own story</STKButton>
                                     </Link>
                                     <span className="text-md text-gray-600 py-2 lg:py-0 lg:px-4">or</span>
                                     <Link href="/discover" className="w-full lg:w-auto">
                                         <STKButton variant="outlined" fullWidth={onMobile}>Add Stories from the Public Library</STKButton>
                                     </Link>
                                 </div>
                             </div>
                         ) : null}
                     </>
                    )}
                </div>
                <>
                    {privateStories.length === 0 && Object.keys(storyFilters).length === 0 ? (
                        <></>
                    ) : (
                        <>
                            <div className={`w-full flex flex-col lg:flex-row mb-10 mt-10 justify-between ${disableSearchAndFilters() ? 'disabled' : ''}`}>
                                <div className="w-full max-w-xl">
                                    <STKTextField
                                        placeholder="Search in my library..."
                                        value={filterQuery}
                                        fluid
                                        startAdornment={<MagnifyingGlass size="20" />}
                                        onChange={handleFilterQueryChange}
                                    />
                                </div>
                                <div className="mt-2 lg:mt-0">
                                    <StoryFilters
                                        privateStories
                                        onChange={() => setSelectedStory(undefined)} />
                                </div>
                            </div>
                            {Object.keys(storyFilters).length > 0 ? (
                                <div className="mb-4">
                                    <StoryFiltersSummary
                                        privateStories
                                        onChange={() => setSelectedStory(undefined)} />
                                </div>
                            ) : null}
                            <Divider />
                        </>
                    )}
                </>
            </div>
            {loaded ? (
                <div className="flex w-full mt-6 pb-32 lg:pb-0">
                        {stories.length > 0 ? (
                            <div className="overflow-y-scroll hide-scrollbar w-full"
                                 style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}>
                                {stories?.map((story: Story) => (
                                    <div
                                        className="mt-2 first:mt-0"
                                        key={story.storyId}
                                    >
                                        <StoryCard
                                            story={story}
                                            enableMenuOptions
                                            // @ts-ignore
                                            onClick={() => handleStoryClick(story)}
                                            menuOptions={story.isPublic ? [{
                                                label: "Add to collection",
                                                value: ADD_TO_LIBRARY_MENU_OPTION
                                            }] : [
                                                { label: "Add to collection", value: ADD_TO_LIBRARY_MENU_OPTION },
                                                { label: "Submit to public library", value: SUBMIT_TO_PUBLIC_LIBRARY_MENU_OPTION },
                                                { label: "Edit story", value: EDIT_STORY_MENU_OPTION },
                                                { label: "Delete story", value: DELETE_STORY_MENU_OPTION }
                                            ]}
                                            selected={selectedStory?.storyId === story?.storyId}
                                        ></StoryCard>
                                    </div>
                                ))}
                            </div>
                        ) : stories.length === 0 && Object.keys(storyFilters).length > 0 ? (
                            <div className="flex flex-col items-center">
                                <SmileyMeh size={100} color={neutral300} />
                                <p className="mt-4 text-center max-w-lg">
                                    It looks like we could not find any index matching your filters.
                                    Try adjusting your filter settings to see more results.
                                </p>
                            </div>
                        ) : null}

                    {selectedStory !== undefined && (
                        <div
                        className="hidden lg:flex lg:ml-10 w-full overflow-y-scroll"
                        style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}>
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                    key={selectedStory?.storyId}
                                >
                                    <StoryDetails story={selectedStory}/>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full mt-4">
                    <div>
                        <STKSkeleton width="100%" height="56px" />
                    </div>
                    <div className="mt-10">
                        {[1,2,3].map((_, index) => (
                            <div className="w-full first:mt-0 mt-2" key={index}>
                                <StoryCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                story={selectedStory !== undefined && selectedStory !== null ? selectedStory : null}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}

export default withAuth(withProfile((Library)))
