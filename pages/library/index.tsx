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

export default function Library() {
    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [stories, setStories] = useState<StoryWithProfile[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)
    const [recordedAudioUrl, setRecordedAudioUrl] = useState("")

    const handleFilterQueryChange = (e: React.FormEvent<HTMLInputElement>) => {
        setFilterQuery(e.currentTarget.value)
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

    const handleRecordOnComplete = (recordUrl: any) => {
        setRecordedAudioUrl(recordUrl)
    }

    return (
        <PageWrapper path="library">
            <div className="flex items-center">
                My story library
                <span>
                    <STKTooltip title="Stories in your library are private to your account, but can be accessed from any of your profiles.">
                        i
                    </STKTooltip>
                </span>
            </div>
            {loaded && (
                <div className="flex sm:w-full">
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
                                    <div>
                                        <div>
                                            <MagnifyingGlass size="20" />
                                        </div>
                                        <STKTextField
                                            placeholder="Search in my library..."
                                            value={filterQuery}
                                            onChange={handleFilterQueryChange}
                                        />
                                    </div>
                                )}
                                <div className="overflow-y-scroll" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "70vh" }}>
                                    {filtered?.map((story: StoryWithProfile, index: number) => (
                                        <a
                                            key={story.story_id}
                                            onClick={() => handleStoryClick(index)}
                                        >
                                            <StoryCard
                                                story={story}
                                                selected={selectedIndex === index}
                                            ></StoryCard>
                                        </a>
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
                        <div className="hidden lg:flex lg:pl-8 w-full">
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                    key={selectedIndex}
                                >
                                    <StoryDetails story={stories[selectedIndex]}></StoryDetails>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
            <StoryDetailsDialog
                open={showStoryDetailsDialog}
                story={selectedIndex !== undefined && selectedIndex !== null ? stories[selectedIndex] : null}
                onClose={() => setShowStoryDetailsDialog(false)}/>
        </PageWrapper>
    )
}
