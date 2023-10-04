import { useContext, useEffect, useState } from 'react'
import { Profile } from '@/lib/database-helpers.types'
import { usePathname } from 'next/navigation'
import { BookOpenText, Books } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import useDevice from "@/customHooks/useDevice";
import ProfileHandler from "@/handlers/ProfileHandler";
import ProfileContext from "@/contexts/ProfileContext";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {useRouter} from "next/router";
import {neutral800} from "@/assets/colorPallet/colors";
import RecordButton from "@/composedComponents/RecordButton/RecordButton";

export default function SideNavigation() {
    // Hooks
    const pathname = usePathname()
    const { onMobile } = useDevice()
    const route = useRouter()

    // Context
    const { currentProfileId } = useContext(ProfileContext) as any

    // States
    const [currentProfile, setCurrentProfile] = useState<any>(null)
    const [profileOptions, setProfileOptions] = useState<Profile[]>([])

    // Mount
    useEffect(() => {
        loadProfiles()
    }, [])

    // Watchers
    useEffect(() => {
        if (profileOptions?.length > 0) {
            const _currentProfile = profileOptions.find(
                (p) => p.profile_id === currentProfileId
            )

            setCurrentProfile(_currentProfile)
        }
    }, [profileOptions]);

    // Methods
    const loadProfiles = async () => {
        const profiles: Profile[] = await ProfileHandler.fetchProfiles()
        setProfileOptions(profiles)
    }

    const handleTabOnChange = (selectedTab) => {
        route.push(selectedTab.pathname)
    }

    return (
        <nav>
            {currentProfile && (
                <AnimatePresence mode="wait">
                    (
                    <motion.div
                        initial={{ x: onMobile ? 0 : 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 10, opacity: 0 }}
                        key={currentProfile?.profile_id}
                    >
                        <h2 className="m-0 text-base hidden lg:block">Hi, {currentProfile?.profile_name}!</h2>

                        <div className= "nav lg:mt-8 w-full lg:w-auto flex lg:flex-col bg-white lg:bg-transparent justify-center py-6 px-6 lg:p-0 left-0 lg:left-auto fixed z-10 lg:relative bottom-0 lg:bottom-auto">
                           <div className="flex justify-center lg:flex-col -ml-10 lg:ml-0">
                               <STKButtonTabs
                                   useIconButtonOnMobile
                                   tabs={[
                                       { text: "Discover", icon: <BookOpenText size={24} color={neutral800} />, pathname: "/discover"  },
                                       { text: "My Library", icon: <Books size={24} weight="duotone" color={neutral800} />, pathname: "/library" },
                                   ]}
                                   onChange={handleTabOnChange}
                               />

                               <div className="lg:mt-6 ml-4 lg:ml-0 lg:w-full">
                                   <RecordButton />
                               </div>
                           </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </nav>
    )
}
