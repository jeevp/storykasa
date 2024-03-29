import StoryForm from '@/composedComponents/StoryForm/StoryForm'
import PageWrapper from '@/composedComponents/PageWrapper'
import withAuth from "@/HOC/withAuth"
import withProfile from "@/HOC/withProfile"
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import Link from "next/link";
import {useStory} from "@/contexts/story/StoryContext";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import STKLinearProgress from "@/components/STKLinearProgress/STKLinearProgress";
import STKLoading from "@/components/STKLoading/STKLoading";
import {useAuth} from "@/contexts/auth/AuthContext";
import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import {useProfile} from "@/contexts/profile/ProfileContext";

function Record() {
    const { currentSubscription } = useSubscription()
    const { currentUser } = useAuth()
    const { currentProfileId } = useProfile()
    const { totalRecordingTime, setTotalRecordingTime } = useStory()

    // States
    const [loading, setLoading] = useState(true)
    const [loadingUnfinishedStories, setLoadingUnfinishedStories] = useState(true)
    const [allowStoryCreation, setAllowStoryCreation] = useState(true)
    const [recordingTimeAvailable, setRecordingTimeAvailable] = useState("")
    const [unfinishedStories, setUnfinishedStories] = useState([])
    const [selectedUnfinishedStory, setSelectedUnfinishedStory] = useState(null)

    // Mounted
    useEffect(() => {
        handleFetchTotalRecordingTime()
        handleFetchUnfinishedStories()
    }, []);

    // Watchers
    useEffect(() => {
        if (currentSubscription?.adminAccount) {
            setAllowStoryCreation(true)
        } else if (totalRecordingTime && currentSubscription && currentSubscription?.maxRecordingTimeAllowed) {
            setAllowStoryCreation(totalRecordingTime < currentSubscription?.maxRecordingTimeAllowed)
            // @ts-ignore
            setRecordingTimeAvailable(Math.round((currentSubscription?.maxRecordingTimeAllowed) - totalRecordingTime))
        }
    }, [totalRecordingTime, currentSubscription])

    // Methods
    const handleFetchTotalRecordingTime = async () => {
        setLoading(true)
        const _totalRecordingTime = await StoryHandler.fetchTotalRecordingTime()
        setTotalRecordingTime(_totalRecordingTime)
        setLoading(false)
    }

    const handleFetchUnfinishedStories = async () => {
        setLoadingUnfinishedStories(true)
        const unfinishedStories = await StoryHandler.fetchUnfinishedStories({ profileId: currentProfileId })
        setUnfinishedStories(unfinishedStories)
        setLoadingUnfinishedStories(false)
    }

    const recordingTimeUsagePercentage = currentSubscription?.getRecordingTimeUsagePercentage(totalRecordingTime)
    const recordingTimeLabel = `${recordingTimeAvailable} minutes available`

    const handleStoryOnSave = () => {
        // @ts-ignore
        setUnfinishedStories([...unfinishedStories.filter((story) => story.storyId !== selectedUnfinishedStory?.storyId)])
    }

    return (
        <PageWrapper path="record">
            <div className="pb-10">
                {!currentSubscription?.adminAccount && !allowStoryCreation && !currentUser?.isGuest && (
                    <div className="bg-orange-100 p-4 rounded-xl inline-block mb-2">
                        <p>Your account has reached the maximum recording time allowed. <Link href="/account-settings" className="no-underline text-neutral-800 font-semibold"> Upgrade</Link> your subscription plan and record more stories.</p>
                    </div>
                )}
                <div className={`mt-10 ${allowStoryCreation ? '' : 'disabled'}`}>
                    <h2 className="m-0 text-2xl">Create a story</h2>
                    <p className="mt-4 max-w-2xl">
                        Record a story of your own. Remember, only profiles on your account can view and listen to
                        your story. Feel free to enhance it with a description and illustrations or images
                    </p>
                    <div className="mt-10">
                        <h3 className="font-semibold m-0">
                            Unfinished stories
                        </h3>
                        <div>
                            {loadingUnfinishedStories ? (
                                <div className="flex mt-5"><STKLoading /></div>
                            ) : (
                              <>
                                  {unfinishedStories?.length > 0 ? (
                                      <div className="mt-5">
                                          {unfinishedStories.map((story) => (
                                              <div key={story} className="first:mt-0 mt-2">
                                                  <STKCard>
                                                      <div className="p-4 flex items-center justify-between">
                                                          <label>
                                                          {
                                                            // @ts-ignore
                                                            story?.title
                                                          }
                                                          </label>
                                                          <div className="flex items-center gap-2">
                                                              <STKButton
                                                                  variant="outlined"
                                                                  height="30px"
                                                                  onClick={() => setSelectedUnfinishedStory(story)}>
                                                                  Continue
                                                              </STKButton>
                                                          </div>
                                                      </div>
                                                  </STKCard>
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <label className="mt-4">You don&ldquo;t have any unfinished story to complete.</label>
                                  )}
                              </>
                            )}
                        </div>
                    </div>
                    {!currentSubscription?.adminAccount && !currentUser?.isGuest ? (
                        <div className="mt-8">
                            <div className="flex mb-2">
                                {loading ? (
                                    <STKLoading />
                                ) : (
                                    <label>{recordingTimeUsagePercentage?.toFixed(2) || 0}% usage</label>
                                )}
                            </div>

                            <STKLinearProgress value={!loading && recordingTimeUsagePercentage ? recordingTimeUsagePercentage : 0} />
                            <div className="mt-2 flex items-center justify-between">
                                {loading ? (
                                    <STKLoading />
                                ) : (
                                    <>
                                        <label className="font-semibold">{recordingTimeLabel}</label>
                                        <label>{currentSubscription?.maxRecordingTimeAllowed} minutes</label>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : null}
                    <div className="mt-10">
                        <StoryForm unfinishedStory={selectedUnfinishedStory} onSave={handleStoryOnSave}></StoryForm>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default withAuth(withProfile(Record))
