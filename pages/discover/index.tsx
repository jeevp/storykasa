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
import {MagnifyingGlass} from "@phosphor-icons/react";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";

export const dynamic = 'force-dynamic'

function Discover() {
    const { onMobile } = useDevice()
    const [stories, setStories] = useState<Story[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filterQuery, setFilterQuery] = useState('')

    const loadStories = async () => {
        setLoading(true)
        const publicStories: Story[] = await StoryHandler.fetchPublicStories()
        setStories(publicStories)
        setLoading(false)
    }

    useEffect(() => {
        loadStories()
    }, [])

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
    }

    const handleStoryClick = (index: number) => {
        setSelectedIndex(index)
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    const filtered = stories
        ? stories.filter((story) =>
            story.title.toLowerCase().includes(filterQuery.toLowerCase())
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

            <div className="flex sm:w-full mt-4 pb-32 lg:pb-0">
                {!loading && stories ? (
                    <AnimatePresence mode="wait">
                        (
                        <motion.div
                            initial={{ x: 10, opacity: 0, width: "100%" }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={stories.length}
                        >
                            {stories.length > 0 && (
                                <div className="w-full">
                                    <STKTextField
                                        placeholder="Search a story..."
                                        value={filterQuery}
                                        fluid
                                        startAdornment={<MagnifyingGlass size="20" />}
                                        onChange={handleFilterQueryChange}
                                    />
                                </div>
                            )}
                            <div className="overflow-y-scroll mt-10" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "75vh" }}>
                            {filtered?.map((story: Story, index: number) => (
                                    <div
                                        className="mt-2 first:mt-0"
                                        key={story?.storyId}
                                        onClick={() => handleStoryClick(index)}
                                    >
                                        <StoryCard
                                            story={story}
                                            selected={index === selectedIndex}
                                        ></StoryCard>
                                    </div>
                                ))}
                            </div>
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

                {selectedIndex !== undefined && (
                    <div className="hidden lg:flex lg:w-full lg:pl-8">
                        <StoryDetails story={stories[selectedIndex]} editionNotAllowed></StoryDetails>
                    </div>
                )}
            </div>

            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                editionNotAllowed
                // @ts-ignore
                story={selectedIndex !== undefined && selectedIndex !== null ? stories[selectedIndex] : null}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}

export default withAuth(withProfile(Discover))
