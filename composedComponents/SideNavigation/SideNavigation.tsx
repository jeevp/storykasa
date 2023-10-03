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

export default function SideNavigation() {
    // Hooks
    const pathname = usePathname()
    const { onMobile } = useDevice()

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
        if (profileOptions.length > 0) {
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

    console.log({ currentProfile, profileOptions, currentProfileId })

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
                        <h2>Hi, {currentProfile?.profile_name}!</h2>

                        <div
                            className="nav lg:mt-8 w-full lg:w-auto flex lg:flex-col bg-white lg:bg-transparent justify-center py-6 px-6 lg:p-0 left-0 lg:left-auto fixed z-10 lg:relative bottom-0 lg:bottom-auto">
                            <div className="w-full">
                                <Link href="/discover" passHref legacyBehavior>
                                    <STKButton startIcon={<BookOpenText size={24} />}>
                                        Discover
                                    </STKButton>
                                    {/*<a*/}
                                    {/*    role="button"*/}
                                    {/*    title="Discover new publicly available stories"*/}
                                    {/*    href="/discover"*/}
                                    {/*    className={`h-12 lg:h-auto ${pathname === "/discover" ? 'select-btn active' : 'select-btn'}`}*/}
                                    {/*>*/}
                                    {/*    <div className="flex items-center">*/}
                                    {/*        */}
                                    {/*        <span className="ml-2 hidden lg:block">Discover</span>*/}
                                    {/*    </div>*/}
                                    {/*</a>*/}
                                </Link>
                            </div>

                            <div className="mt-2">
                                <Link href="/library" passHref legacyBehavior>
                                    <STKButton startIcon={<Books size={24} weight="duotone" />}>
                                        My library
                                    </STKButton>
                                    {/*            <a*/}
                                    {/*                role="button"*/}
                                    {/*                title="Listen to the stories in your library"*/}
                                    {/*                href="/library"*/}
                                    {/*                className={`h-12 lg:h-auto ml-4 lg:mt-4 lg:ml-0 ${pathname === "/library" ? 'select-btn active' : 'select-btn'}`}*/}
                                    {/*            >*/}
                                    {/*                <div className="flex">*/}
                                    {/*                    */}
                                    {/*                    <span className="ml-2 hidden lg:block">*/}
                                    {/*    */}
                                    {/*</span>*/}
                                    {/*                </div>*/}
                                    {/*            </a>*/}
                                </Link>
                            </div>

                            <div className="mt-6">
                                <Link href="/record" passHref legacyBehavior>
                                    <STKButton startIcon={<Microphone size={24} weight="duotone" />}>
                                        Add a story
                                    </STKButton>
                                    {/*            <a*/}
                                    {/*                role="button"*/}
                                    {/*                title="Record and add a new story"*/}
                                    {/*                href="/record"*/}
                                    {/*                className={`h-12 lg:h-auto lg:mt-8 mt-0 ml-4 lg:ml-0 ${pathname === "/record" ? 'raised-btn active' : 'raised-btn'}`}*/}
                                    {/*            >*/}
                                    {/*                <div className="flex">*/}
                                    {/*                    */}
                                    {/*                    <span className="ml-2 hidden lg:block">*/}

                                    {/*</span>*/}
                                    {/*                </div>*/}
                                    {/*            </a>*/}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </nav>
    )
}
