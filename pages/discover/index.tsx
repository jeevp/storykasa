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

export const dynamic = 'force-dynamic'

function Discover() {
    const { onMobile } = useDevice()
    const [stories, setStories] = useState<Story[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)

    const loadStories = async () => {
        const publicStories: Story[] = await StoryHandler.fetchPublicStories()
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
            <h2 className="m-0">
                Discover stories
            </h2>

            <div className="flex sm:w-full mt-4 pb-32 lg:pb-0">
                {stories && (
                    <AnimatePresence mode="wait">
                        (
                        <motion.div
                            initial={{ x: 10, opacity: 0, width: "100%" }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            key={stories.length}
                        >
                            <div className="overflow-y-scroll mt-10" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "75vh" }}>
                            {stories?.map((story: Story, index: number) => (
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
