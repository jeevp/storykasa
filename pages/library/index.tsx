import StoryCard from '@/composedComponents/StoryCard/StoryCard'
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

function Library() {
    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)

    // Contexts
    const { privateStories, setPrivateStories, storyFilters } = useStory()
    const { currentProfileId } = useProfile()

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
    }

    const loadStories = async () => {
        const allStories: Story[] = await StoryHandler.fetchPrivateStories({}, {
            profileId: currentProfileId
        })
        // @ts-ignore
        setPrivateStories(allStories)
        setLoaded(true)
    }

    const filtered = privateStories
        ? privateStories.filter((story) =>
            // @ts-ignore
            story?.title?.toLowerCase()?.includes(filterQuery.toLowerCase())
        )
        : []

    const handleStoryClick = (index: number) => {
        setSelectedIndex(index)
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
                <div className="mt-4 max-w-2xl">
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
                                 These stories can only be seen by other profiles in your account. This is the home for
                                 the stories you record.
                             </p>
                         ) : privateStories.length === 0 && Object.keys(storyFilters).length === 0 ? (
                             <p>
                                 Your library is empty, but you can change that! It’s easy to
                                 <span className="font-semibold underline-offset-0">
                                <Link href="/record"> create your own story</Link>
                            </span>.
                             </p>
                         ) : null}
                     </>
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
                        <div className="mt-2 lg:mt-0">
                            <StoryFilters
                            privateStories
                            onChange={() => setSelectedIndex(undefined)} />
                        </div>
                    </div>
                    {Object.keys(storyFilters).length > 0 ? (
                        <div className="mb-4">
                            <StoryFiltersSummary
                            privateStories
                            onChange={() => setSelectedIndex(undefined)} />
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
                            className="w-full"
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={privateStories.length}
                        >
                            {filtered.length > 0 ? (
                                <div className="overflow-y-scroll hide-scrollbar" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}>
                                    {filtered?.map((story: Story, index: number) => (
                                        <div
                                            className="mt-2 first:mt-0"
                                            key={story.storyId}
                                            onClick={() => handleStoryClick(index)}
                                        >
                                            <StoryCard
                                                story={story}
                                                selected={selectedIndex === index}
                                            ></StoryCard>
                                        </div>
                                    ))}
                                </div>
                            ) : filtered.length === 0 && Object.keys(storyFilters).length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <SmileyMeh size={100} color={neutral300} />
                                    <p className="mt-4 text-center max-w-lg">
                                        It looks like we could not find any stories matching your filters.
                                        Try adjusting your filter settings to see more results.
                                    </p>
                                </div>
                            ) : null}
                        </motion.div>
                    </AnimatePresence>

                    {selectedIndex !== undefined && (
                        <div
                        className="hidden lg:flex lg:ml-10 w-full overflow-y-scroll"
                        style={onMobile ? { maxHeight: "auto" } : { maxHeight: "58vh" }}>
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                    key={selectedIndex}
                                >
                                    <StoryDetails story={privateStories[selectedIndex]} onLoadStories={() => loadStories()}></StoryDetails>
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
                story={selectedIndex !== undefined && selectedIndex !== null ? privateStories[selectedIndex] : null}
                onLoadStories={() => loadStories()}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}

export default withAuth(withProfile((Library)))
