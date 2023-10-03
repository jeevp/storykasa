import ProfileSwitcher from '@/composedComponents/ProfileSwitcher/ProfileSwitcher'
import PageWrapper from '@/composedComponents/PageWrapper'
import ProfileProvider from '@/composedComponents/ProfileProvider/ProfileProvider'
import {useEffect, useState} from "react";
import ProfileHandler from "@/handlers/ProfileHandler";
import STKButton from "@/components/STKButton/STKButton";
import {ArrowLeft, Users} from "@phosphor-icons/react";

export default function Profiles() {
    // States
    const [profiles, setProfiles] = useState([])
    const [managing, setManaging] = useState(false)

    // Watchers
    useEffect(() => {
        handleFetchProfiles()
    }, []);

    // Methods
    const handleFetchProfiles = async () => {
        const _profiles = await ProfileHandler.fetchProfiles()
        setProfiles(_profiles)
    }

    return (
        <ProfileProvider>
            <PageWrapper path="profiles">
                <div className="flex items-center">
                    <h1>
                        Choose a profile
                    </h1>
                    <div className="ml-4">
                        <STKButton
                            rounded
                            slim
                            variant={managing ? 'outlined' : 'contained'}
                            startIcon={managing ? null : <Users size={20} />}
                            onClick={() => setManaging(!managing)}>
                            {managing ? "Exit managing" : "Manage profiles"}
                        </STKButton>
                    </div>
                </div>
                <div>
                    <ProfileSwitcher
                        profiles={profiles}
                        managing={managing}
                        key={profiles.length}
                    ></ProfileSwitcher>
                </div>
            </PageWrapper>
        </ProfileProvider>
    )
}
