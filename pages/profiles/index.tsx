import ProfileSwitcher from '@/composedComponents/ProfileSwitcher/ProfileSwitcher'
import PageWrapper from '@/composedComponents/PageWrapper'
import ProfileProvider from '@/composedComponents/ProfileProvider/ProfileProvider'
import {useEffect, useState} from "react";
import ProfileHandler from "@/handlers/ProfileHandler";

export default function Profiles() {
    // States
    const [profiles, setProfiles] = useState([])

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
                <h1>
                    Choose a profile
                </h1>
                <div className="lg:w-96">
                    <ProfileSwitcher
                        profiles={profiles}
                        key={profiles.length}
                    ></ProfileSwitcher>
                </div>
            </PageWrapper>
        </ProfileProvider>
    )
}
