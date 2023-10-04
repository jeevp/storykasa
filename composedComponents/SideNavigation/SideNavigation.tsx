import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { Profile } from '@/lib/database-helpers.types'
import { usePathname } from 'next/navigation'
import { BookOpenText, Books, Microphone } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import useDevice from "@/customHooks/useDevice";
import ProfileHandler from "@/handlers/ProfileHandler";
import ProfileContext from "@/contexts/ProfileContext";
import STKButton from "@/components/STKButton/STKButton";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {useRouter} from "next/router";

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
                        <h2 className="m-0 text-base">Hi, {currentProfile?.profile_name}!</h2>

                        <div className= "nav lg:mt-8 w-full lg:w-auto flex lg:flex-col bg-white lg:bg-transparent justify-center py-6 px-6 lg:p-0 left-0 lg:left-auto fixed z-10 lg:relative bottom-0 lg:bottom-auto">
                            <STKButtonTabs
                                tabs={[
                                    { text: "Discover", icon: <BookOpenText size={24} />, pathname: "/discovery"  },
                                    { text: "My Library", icon: <Books size={24} weight="duotone" />, pathname: "/library" },
                                ]}
                                onChange={handleTabOnChange}
                            />
                            {/*<div className="w-full">*/}
                            {/*    <STKButton*/}
                            {/*    alignStart*/}
                            {/*    fullWidth*/}
                            {/*    height="45px"*/}
                            {/*    color="secondary"*/}
                            {/*    variant={pathname === "/discover" ? 'contained' : 'outlined'}*/}
                            {/*    startIcon={<BookOpenText size={24} />}>*/}
                            {/*        Discover*/}
                            {/*    </STKButton>*/}
                            {/*</div>*/}

                            {/*<div className="mt-2">*/}
                            {/*    <STKButton*/}
                            {/*    alignStart*/}
                            {/*    fullWidth*/}
                            {/*    color="secondary"*/}
                            {/*    height="45px"*/}
                            {/*    variant={pathname === "/library" ? 'contained' : 'outlined'}*/}
                            {/*    startIcon={<Books size={24} weight="duotone" />}>*/}
                            {/*        My library*/}
                            {/*    </STKButton>*/}
                            {/*</div>*/}

                            <div className="mt-6">
                                <STKButton
                                alignStart
                                fullWidth
                                height="45px"
                                startIcon={<Microphone size={24} weight="duotone" />}>
                                    Add a story
                                </STKButton>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </nav>
    )
}
