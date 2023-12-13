import StoryCard from '@/composedComponents/StoryCard/StoryCard'
import { useEffect, useState } from 'react'
import StoryDetails from '@/composedComponents/StoryDetails/StoryDetails'
import PageWrapper from '@/composedComponents/PageWrapper'
import { AnimatePresence, motion } from 'framer-motion'
import StoryDetailsDialog from "@/composedComponents/StoryDetailsDialog/StoryDetailsDialog";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import Story from "@/models/Story";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import STKTextField from "@/components/STKTextField/STKTextField";
import {MagnifyingGlass, SmileyMeh} from "@phosphor-icons/react";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryFilters from "@/composedComponents/StoryFilters/StoryFilters";
import {Divider} from "@mui/material";
import {useStory} from "@/contexts/story/StoryContext";
import {neutral300} from "@/assets/colorPallet/colors";
import StoryFiltersSummary from "@/composedComponents/StoryFilters/StoryFiltersSummary/StoryFiltersSummary";
import HeardAboutDialog from "@/composedComponents/HeardAboutDialog/HeardAboutDialog";
import {useAuth} from "@/contexts/auth/AuthContext";

export const dynamic = 'force-dynamic'

function Discover() {
    const { onMobile } = useDevice()
    const [stories, setStories] = useState<Story[]>([])
    const [selectedStoryId, setSelectedStoryId] = useState<string>()
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filterQuery, setFilterQuery] = useState('')
    const [selectedStory, setSelectedStory] = useState<Story | undefined>(undefined)

    // Contexts
    const {
        publicStories,
        setPublicStories,
        storyFilters
    } = useStory()

    const { showHeardAboutDialog, setShowHeardAboutDialog } = useAuth()

    const loadStories = async () => {
        setLoading(true)
        const _publicStories: Story[] = await StoryHandler.fetchPublicStories({})
        // @ts-ignore
        setPublicStories(_publicStories)
        setLoading(false)
    }

    useEffect(() => {
        loadStories()
    }, [])

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
    }

    const handleStoryClick = (story: Story) => {
        setSelectedStoryId(story?.storyId)
        setSelectedStory(publicStories.find((_story: Story) => _story.storyId === story?.storyId))
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    const disableSearchAndFilters = () => {
        return (
            publicStories?.length === 0
            && Object.keys(storyFilters).length === 0
        )
    }

    const filtered = publicStories
        ? publicStories.filter((story) =>
            // @ts-ignore
            story?.title?.toLowerCase().includes(filterQuery.toLowerCase())
        )
        : []


    return (
        <PageWrapper path="discover">
            <div>
                <h2 className="m-0">
                    Discover stories
                </h2>
                <div className="mt-4 max-w-2xl">
                    <p>
                        Browse the StoryKasa collection of stories from around the world, recorded and narrated by
                        real people. Filter by language or age group and click a story to start listening.
                    </p>
                </div>
            </div>
            <>
                <div className={`w-full flex flex-col lg:flex-row mb-10 mt-10 justify-between ${disableSearchAndFilters() ? 'disabled' : ''}`}>
                    <div className="w-full max-w-xl">
                        <STKTextField
                            placeholder="Search our story collection."
                            value={filterQuery}
                            fluid
                            startAdornment={<MagnifyingGlass size="20" />}
                            onChange={handleFilterQueryChange}
                        />
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <StoryFilters privateStories={false} onChange={() => setSelectedStoryId(undefined)} />
                    </div>
                </div>
                {Object.keys(storyFilters).length > 0 ? (
                    <div className="mb-4">
                        <StoryFiltersSummary
                        privateStories={false}
                        onChange={() => setSelectedStoryId(undefined)}/>
                    </div>
                ) : null}
                <Divider />
            </>
            <div className="flex sm:w-full mt-6 pb-32 lg:pb-0">
                {!loading && stories ? (
                    <AnimatePresence mode="wait">
                        (
                        <motion.div
                            initial={{ x: 10, opacity: 0, width: "100%" }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={stories.length}
                        >
                            {filtered.length > 0  ? (
                                <div className="overflow-y-scroll hide-scrollbar" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "62vh" }}>
                                    {filtered?.map((story: Story, index: number) => (
                                        <div
                                            className="mt-2 first:mt-0"
                                            key={story?.storyId}
                                            onClick={() => handleStoryClick(story)}
                                        >
                                            <StoryCard
                                                story={story}
                                                selected={story?.storyId === selectedStoryId}
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
                ): (
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

                {selectedStoryId !== undefined && (
                    <div className="hidden lg:flex lg:w-full lg:pl-8">
                        <StoryDetails
                            // @ts-ignore
                            story={selectedStory}
                            editionNotAllowed />
                    </div>
                )}

            </div>

            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                editionNotAllowed
                // @ts-ignore
                story={selectedStoryId !== undefined && selectedStoryId !== null ? publicStories.find((story: Story) => story.storyId === selectedStoryId) : null}
                onClose={() => setShowStoryDetailsDialog(false)}/>
            <HeardAboutDialog active={showHeardAboutDialog} onClose={() => setShowHeardAboutDialog(false)} />
        </PageWrapper>
    )
}

export default withAuth(withProfile(Discover))
