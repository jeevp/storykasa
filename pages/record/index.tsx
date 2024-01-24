import StoryForm from '@/composedComponents/StoryForm/StoryForm'
import PageWrapper from '@/composedComponents/PageWrapper'
import withAuth from "@/HOC/withAuth"
import withProfile from "@/HOC/withProfile"
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import Link from "next/link";
import {useStory} from "@/contexts/story/StoryContext";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";

function Record() {
    const { currentSubscription } = useSubscription()
    const { totalRecordingTime, setTotalRecordingTime } = useStory()

    // States
    const [allowStoryCreation, setAllowStoryCreation] = useState(true)

    // Mounted
    useEffect(() => {
        handleFetchTotalRecordingTime()
    }, []);

    // Watchers
    useEffect(() => {
        if (totalRecordingTime && currentSubscription && currentSubscription?.maxRecordingTimeAllowed) {
            setAllowStoryCreation(totalRecordingTime < currentSubscription?.maxRecordingTimeAllowed)
        }
    }, [totalRecordingTime, currentSubscription])

    // Methods
    const handleFetchTotalRecordingTime = async () => {
        const _totalRecordingTime = await StoryHandler.fetchTotalRecordingTime()
        setTotalRecordingTime(_totalRecordingTime)
    }


    return (
        <PageWrapper path="record">
            <div>
                {!allowStoryCreation && (
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
                        <StoryForm></StoryForm>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default withAuth(withProfile(Record))
