import StoryCard from '@/composedComponents/StoryCard/StoryCard'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { useEffect, useState} from 'react'
import StoryDetails from '@/composedComponents/StoryDetails/StoryDetails'
import PageWrapper from '@/composedComponents/PageWrapper'
import {AnimatePresence, motion} from 'framer-motion'
import {MagnifyingGlass} from '@phosphor-icons/react'
import useDevice from "@/customHooks/useDevice";
import StoryDetailsDialog from "@/composedComponents/StoryDetailsDialog/StoryDetailsDialog";
import STKTooltip from "@/composedComponents/STKTooltip/STKTooltip";
import STKTextField from "@/components/STKTextField/STKTextField";
import Link from "next/link";
import StoryHandler from "@/handlers/StoryHandler";
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";

function Library() {
    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [stories, setStories] = useState<StoryWithProfile[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [recordedAudioUrl, setRecordedAudioUrl] = useState("")

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
    }

    const loadStories = async () => {
        const allStories: StoryWithProfile[] = await StoryHandler.fetchStories()
        setStories(allStories)
        setLoaded(true)
    }

    const filtered = stories
        ? stories.filter((story) =>
            story.title.toLowerCase().includes(filterQuery.toLowerCase())
        )
        : []

    const handleStoryClick = (index: number) => {
        setSelectedIndex(index)
        if (onMobile) setShowStoryDetailsDialog(true)
    }

    useEffect(() => {
        loadStories()
    }, [])


    return (
        <PageWrapper path="library">
            <div className="flex items-center">
                <h2 className="m-0 text-2xl">
                    My story library
                    <span>
                        <STKTooltip title="Stories in your library are private to your account, but can be accessed from any of your profiles.">

                        </STKTooltip>
                    </span>
                </h2>
            </div>
            {loaded && (
                <div className="flex sm:w-full mt-4 pb-32 lg:pb-0">
                    {stories.length ? (
                        <AnimatePresence mode="wait">
                            (
                            <motion.div
                                className="w-full"
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 10, opacity: 0 }}
                                key={stories.length}
                            >
                                {stories.length > 0 && (
                                    <div className="w-full">
                                        <STKTextField
                                            placeholder="Search in my library..."
                                            value={filterQuery}
                                            fluid
                                            startAdornment={<MagnifyingGlass size="20" />}
                                            onChange={handleFilterQueryChange}
                                        />
                                    </div>
                                )}
                                <div className="overflow-y-scroll mt-10" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "70vh" }}>
                                    {filtered?.map((story: StoryWithProfile, index: number) => (
                                        <div
                                            className="mt-2 first:mt-0"
                                            key={story.story_id}
                                            onClick={() => handleStoryClick(index)}
                                        >
                                            <StoryCard
                                                story={story}
                                                selected={selectedIndex === index}
                                            ></StoryCard>
                                        </div>
                                    ))}
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="flex flex-col mt-4">
                            <div>
                                <div>
                                    <div>
                                        No stories yet...{' '}
                                    </div>
                                    <p>
                                        Get started by{' '}
                                        <Link
                                            color="grass"
                                            href="/record"
                                        >
                                            adding your first story
                                        </Link>{' '}
                                        to your personal library.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedIndex !== undefined && (
                        <div
                        className="hidden lg:flex lg:ml-10 w-full overflow-y-scroll"
                        style={onMobile ? { maxHeight: "auto" } : { maxHeight: "80vh" }}>
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                    key={selectedIndex}
                                >
                                    <StoryDetails story={stories[selectedIndex]} onLoadStories={() => loadStories()}></StoryDetails>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                story={selectedIndex !== undefined && selectedIndex !== null ? stories[selectedIndex] : null}
                onLoadStories={() => loadStories()}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}

export default withAuth(withProfile((Library)))
