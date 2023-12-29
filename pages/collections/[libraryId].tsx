import StoryCard, {REMOVE_FROM_COLLECTION_MENU_OPTION} from '@/composedComponents/StoryCard/StoryCard'
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
import {useRouter} from "next/router";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";
import {ArrowBack} from "@mui/icons-material";
import AddListenerDialog from "@/composedComponents/AddListenerDialog/AddListenerDialog";

function Library() {
    const router = useRouter()

    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [selectedStory, setSelectedStory] = useState<Story | undefined>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [stories, setStories] = useState([])
    const [showAddListenerDialog, setShowAddListenerDialog] = useState(false)

    // Contexts
    const { storyFilters } = useStory()
    const { currentLibraryStories, setCurrentLibraryStories, currentLibrary } = useLibrary()

    // Watchers
    useEffect(() => {
        if (currentLibraryStories) {
            setStories([...currentLibraryStories])
        }
    }, [currentLibraryStories]);

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
        const filteredStories = currentLibraryStories.filter((story: Story) => {
            return story?.title?.toLowerCase()?.includes(value.toLowerCase())
        })

        setStories(filteredStories)
    }

    const loadStories = async () => {
        const libraryStories: Story[] = await LibraryHandler.fetchStories({
            libraryId: String(router.query.libraryId)
        })

        // @ts-ignore
        setCurrentLibraryStories(libraryStories)
        // @ts-ignore
        setStories(libraryStories)
        setLoaded(true)
    }

    const handleStoryClick = (story: Story) => {
        setSelectedStory(story)
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    const disableSearchAndFilters = () => {
        return (
            currentLibraryStories?.length === 0
            && Object.keys(storyFilters).length === 0
        )
    }

    useEffect(() => {
        if (router?.query?.libraryId) {
            loadStories()
        }
    }, [router])

    const gotToLibrariesPage = async () => {
        await router.push("/collections", "", {
            shallow: true
        })
    }


    return (
        <PageWrapper path="library">
            <div>
                <div className="flex items-center">
                    <STKButton iconButton onClick={gotToLibrariesPage}><ArrowBack /></STKButton>
                    <h2 className="m-0 text-2xl ml-2">
                        {router.query.libraryName}
                        <span>
                        <STKTooltip title="Stories in your library are private to your account, but can be accessed from any of your profiles.">

                        </STKTooltip>
                    </span>
                    </h2>
                </div>
                {
                    // @ts-ignore
                    currentLibrary?.profile?.profileName && (
                        <div className="mt-2 mb-4">
                            <label
                            className="text-sm">
                                Collection created by {
                                // @ts-ignore
                                currentLibrary?.profile?.profileName
                                }
                            </label>
                        </div>
                    )
                }
                <div className="mt-4 w-full">
                    {!loaded ? (
                        <div className="mb-10">
                            <STKSkeleton width={onMobile ? '300px' : '500px'} height="20px" />
                            <div className="mt-1">
                                <STKSkeleton width={onMobile ? '200px' : '300px'} height="20px" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex w-full flex-col lg:flex-row justify-between">
                            <div>
                                {currentLibraryStories.length || (currentLibraryStories.length === 0 && Object.keys(storyFilters).length > 0) ? (
                                    <p>
                                        This is the home for the index you save or record.
                                    </p>
                                ) : currentLibraryStories.length === 0 && Object.keys(storyFilters).length === 0 ? (
                                    <p>
                                        Your collection is empty! You can add index
                                        from <span className="font-semibold"><Link href="/library"> your library</Link></span> to this collection
                                    </p>
                                ) : null}
                            </div>
                            <div className="w-full lg:w-auto mt-4 lg:mt-0">
                                <STKButton
                                fullWidth={onMobile}
                                onClick={() => setShowAddListenerDialog(true)}>
                                    Add listener
                                </STKButton>
                            </div>
                        </div>
                    )}
                </div>
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
            </div>
            {loaded ? (
                <div className="flex sm:w-full mt-6 pb-32 lg:pb-0">
                    <AnimatePresence mode="wait">
                        (
                        <motion.div
                            initial={{ x: 10, opacity: 0, width: "100%" }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={stories.length}
                        >
                            {stories.length > 0 ? (
                                <div className="overflow-y-scroll hide-scrollbar"
                                     style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}>
                                    {stories?.map((story: Story) => (
                                        <div
                                            className="mt-2 first:mt-0"
                                            key={story.storyId}
                                        >
                                            <StoryCard
                                                story={story}
                                                // @ts-ignore
                                                selected={selectedStory?.storyId === story?.storyId}
                                                menuOptions={[{ label: "Remove from collection", value: REMOVE_FROM_COLLECTION_MENU_OPTION }]}
                                                onClick={() => handleStoryClick(story)}
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
                        </motion.div>
                    </AnimatePresence>

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
                                    <StoryDetails story={selectedStory} onLoadStories={() => loadStories()}></StoryDetails>
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
                onLoadStories={() => loadStories()}
                onClose={() => setShowStoryDetailsDialog(false)}/>
            <AddListenerDialog
                // @ts-ignore
                library={currentLibrary}
                open={showAddListenerDialog}
                onClose={() => setShowAddListenerDialog(false)} />
        </PageWrapper>
    )
}

export default withAuth(withProfile((Library)))
