import StoryCard from '@/composedComponents/StoryCard/StoryCard'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { useEffect, useState } from 'react'
import StoryDetails from '@/composedComponents/StoryDetails/StoryDetails'
import PageWrapper from '@/composedComponents/PageWrapper'
import { AnimatePresence, motion } from 'framer-motion'
import StoryDetailsDialog from "@/composedComponents/StoryDetailsDialog/StoryDetailsDialog";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";

export const dynamic = 'force-dynamic'

export default function Discover() {
    const { onMobile } = useDevice()
    const [stories, setStories] = useState<StoryWithProfile[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)

    const loadStories = async () => {
        const publicStories: StoryWithProfile[] = await StoryHandler.fetchPublicStories()
        setStories(publicStories)
    }

    useEffect(() => {
        loadStories()
    }, [])

    const handleStoryClick = (index: number) => {
        setSelectedIndex(index)
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    return (
        <PageWrapper path="discover">
            <h2>
                Discover stories
            </h2>

            <div className="flex sm:w-full">
                {stories && (
                    <AnimatePresence mode="wait">
                        (
                        <motion.div
                            initial={{ x: 10, opacity: 0, width: "100%" }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={stories.length}
                        >
                            <div
                                style={{ height: !onMobile ? '80vh' : 'auto' }}
                            >
                                {stories?.map((story: StoryWithProfile, index: number) => (
                                    <a
                                        key={story?.story_id}
                                        onClick={() => handleStoryClick(index)}
                                    >
                                        <StoryCard
                                            story={story}
                                            selected={index === selectedIndex}
                                        ></StoryCard>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
                {selectedIndex !== undefined && (
                    <div className="hidden lg:flex lg:w-full lg:pl-8">
                        <StoryDetails story={stories[selectedIndex]}></StoryDetails>
                    </div>
                )}
            </div>

            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                story={selectedIndex !== undefined && selectedIndex !== null ? stories[selectedIndex] : null}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}
