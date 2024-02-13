import ProfileSwitcher from '@/composedComponents/ProfileSwitcher/ProfileSwitcher'
import PageWrapper from '@/composedComponents/PageWrapper'
import {useEffect, useState} from "react";
import ProfileHandler from "@/handlers/ProfileHandler";
import STKButton from "@/components/STKButton/STKButton";
import {Users} from "@phosphor-icons/react";
import withAuth from "@/HOC/withAuth";
import STKLoading from "@/components/STKLoading/STKLoading";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import Link from "next/link"

function Profiles() {
    // States
    const [profiles, setProfiles] = useState([])
    const [managing, setManaging] = useState(false)
    const [loading, setLoading] = useState(true)

    // Contexts
    const { currentSubscription } = useSubscription()

    // Watchers
    useEffect(() => {
        handleFetchProfiles()
    }, []);

    // Methods
    const handleFetchProfiles = async () => {
        const _profiles = await ProfileHandler.fetchProfiles()
        if (_profiles.length === 0) setManaging(true)
        setProfiles(_profiles)
        setLoading(false)
    }


    return (
        <PageWrapper path="profiles">
            {currentSubscription && !currentSubscription?.adminAccount &&  profiles.length >= currentSubscription?.maxProfilesAllowed && (
                <div className="bg-orange-100 p-4 rounded-xl inline-block mb-2">
                    <p>Your account has reached the maximum amount of profiles allowed. <Link href="/account-settings" className="no-underline text-neutral-800 font-semibold"> Upgrade</Link> your subscription plan and create more profiles.</p>
                </div>
            )}
            <div className="flex items-center flex-col lg:flex-row">
                <h1>
                    Choose a profile
                </h1>
                <div className="ml-4">
                    {loading ? (
                        <div>
                            <STKLoading />
                        </div>
                    ) : (
                        <STKButton
                            rounded
                            slim
                            variant={managing ? 'outlined' : 'contained'}
                            startIcon={managing ? null : <Users size={20} />}
                            onClick={() => setManaging(!managing)}>
                            {managing ? "Exit managing" : "Manage profiles"}
                        </STKButton>
                    )}
                </div>
            </div>
            <div>
                <ProfileSwitcher
                    profiles={profiles}
                    managing={managing}
                    key={profiles?.length}
                ></ProfileSwitcher>
            </div>
        </PageWrapper>
    )
}

export default withAuth(Profiles)
