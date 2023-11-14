import StoryCard from '@/composedComponents/StoryCard/StoryCard'
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
import Story from "@/models/Story";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import StoryFilters from "@/composedComponents/StoryFilters/StoryFilters";
import {Divider} from "@mui/material";
import {useStory} from "@/contexts/story/StoryContext";

function Library() {
    const { onMobile } = useDevice()
    const [filterQuery, setFilterQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [loaded, setLoaded] = useState(false)
    const [showStoryDetailsDialog, setShowStoryDetailsDialog] = useState(false)

    // Contexts
    const { privateStories, setPrivateStories } = useStory()

    const handleFilterQueryChange = (value: string) => {
        setFilterQuery(value)
    }

    const loadStories = async () => {
        const allStories: Story[] = await StoryHandler.fetchStories({})
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
            && Object.keys(privateStories).length === 0
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
                        <div>
                            <STKSkeleton width="500px" height="20px" />
                            <div className="mt-1">
                                <STKSkeleton width="300px" height="20px" />
                            </div>
                        </div>
                    ) : (
                     <>
                         {privateStories.length ? (
                             <p>
                                 These stories can only be seen by other profiles in your account. This is the home for
                                 the stories you record.
                             </p>
                         ) : (
                             <p>
                                 Your library is empty, but you can change that! It’s easy to
                                 <span className="font-semibold underline-offset-0">
                                <Link href="/record"> create your own story</Link>
                            </span>.
                             </p>
                         )}
                     </>
                    )}
                </div>
                <>
                    <div className={`w-full flex flex-col lg:flex-row mb-10 justify-between ${disableSearchAndFilters() ? 'disabled' : ''}`}>
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
                    <Divider />
                </>
            </div>
            {loaded ? (
                <div className="flex sm:w-full mt-4 pb-32 lg:pb-0">
                    {privateStories.length ? (
                        <AnimatePresence mode="wait">
                            (
                            <motion.div
                                className="w-full"
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 10, opacity: 0 }}
                                key={privateStories.length}
                            >
                                <div className="overflow-y-scroll mt-10" style={onMobile ? { maxHeight: "auto" } : { maxHeight: "70vh" }}>
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

                            </motion.div>
                        </AnimatePresence>
                    ) : null}

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
