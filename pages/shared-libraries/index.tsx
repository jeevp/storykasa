import StoryCard from '@/composedComponents/StoryCard/StoryCard'
import { useEffect, useState} from 'react'
import StoryDetails from '@/composedComponents/StoryDetails/StoryDetails'
import PageWrapper from '@/composedComponents/PageWrapper'
import {AnimatePresence, motion} from 'framer-motion'
import {Books, MagnifyingGlass, SmileyMeh} from '@phosphor-icons/react'
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
import StoryFiltersSummary from "@/composedComponents/StoryFilters/StoryFiltersSummary/StoryFiltersSummary";
import {green600, neutral300} from "@/assets/colorPallet/colors";
import {useProfile} from "@/contexts/profile/ProfileContext";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";
import CreateSharedLibraryDialog from "@/composedComponents/CreateSharedLibraryDialog/CreateSharedLibraryDialog";
import STKCard from "@/components/STKCard/STKCard";
import LibraryCard from "@/composedComponents/LibraryCard/LibraryCard";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler";

function Libraries() {
    // Contexts
    const {
        libraries,
        setLibraries,
        sharedLibraries,
        setSharedLibraries,
        sharedLibraryInvitations,
        setSharedLibraryInvitations
    } = useLibrary()

    // States
    const [loadingSharedLibraries, setLoadingSharedLibraries] = useState(true)
    const [loadingLibraries, setLoadingLibraries] = useState(true)
    const [loadingSharedLibraryInvitations, setLoadingSharedLibraryInvitations] = useState(true)
    const [showCreateSharedLibraryDialog, setShowCreateSharedLibraryDialog] = useState(false)

    // Mounted
    useEffect(() => {
        handleFetchLibraries()
        handleFetchSharedLibraryInvitations()
    }, [])

    // Methods
    const handleFetchLibraries = async () => {
        setLoadingLibraries(true)
        const _sharedLibraries = await LibraryHandler.fetchLibraries()
        // @ts-ignore
        setLibraries(_sharedLibraries || [])
        setLoadingLibraries(false)
    }

    const handleFetchSharedLibraryInvitations = async () => {
        setLoadingSharedLibraryInvitations(true)
        const sharedLibraryInvitations = await SharedLibraryInvitationHandler.fetchSharedLibraryInvitations()
        // @ts-ignore
        setSharedLibraryInvitations(sharedLibraryInvitations)
        setLoadingSharedLibraryInvitations(false)
    }

    return (
        <PageWrapper path="library">
            <div>
                <div className="flex items-center">
                    <h2 className="m-0 text-2xl">
                        Shared libraries
                    </h2>
                </div>
                <div className="mt-4 flex justify-between w-full items-center">
                    <p>Here you can create libraries to share with friends and family.</p>
                    {libraries.length > 0 && (
                        <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                    )}
                </div>
                <div className="mt-10">
                    <div className="mt-2">
                        {loadingSharedLibraryInvitations ? (
                            <span>loading shared libraries..</span>
                        ): (
                            <>
                                <label className="font-semibold">You have been invited to join the following libraries</label>
                                {sharedLibraryInvitations?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 222px)" }}>
                                        <Books size={100} color={green600} />
                                        <p className="max-w-md text-center">You don't have any shared library available. <br />Create one and start sharing stories</p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start flex-col lg:flex-row flex-wrap">
                                        {sharedLibraryInvitations.map((sharedLibraryInvitation, index) => (
                                            <div className="p-1" key={index}>
                                                <LibraryCard
                                                    library={sharedLibraryInvitation.library}
                                                    sharedLibraryInvitation={sharedLibraryInvitation.sharedLibraryInvitation} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mt-2">
                        {loadingSharedLibraries ? (
                            <span>loading shared libraries..</span>
                        ): (
                            <>
                                <label className="font-semibold">Listening to</label>

                                {sharedLibraries?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 222px)" }}>
                                        <Books size={100} color={green600} />
                                        <p className="max-w-md text-center">You don't have any shared library available. <br />Create one and start sharing stories</p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start flex-col lg:flex-row flex-wrap">
                                        {sharedLibraries.map((sharedLibrary, index) => (
                                            <div className="p-1" key={index}>
                                                <LibraryCard
                                                    library={sharedLibrary.library}
                                                    sharedLibraryInvitation={sharedLibrary.sharedLibraryInvitation} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mt-2">
                        {loadingLibraries ? (
                            <span>loading libraries..</span>
                        ): (
                            <>
                                <label className="font-semibold">Your libraries</label>
                                {libraries?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 222px)" }}>
                                        <Books size={100} color={green600} />
                                        <p className="max-w-md text-center">You don't have any shared library available. <br />Create one and start sharing stories</p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start flex-col lg:flex-row flex-wrap">
                                        {libraries.map((library, index) => (
                                            <div className="p-1 cursor-pointer" key={index}>
                                                <LibraryCard library={library} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <CreateSharedLibraryDialog
                open={showCreateSharedLibraryDialog}
                onClose={() => setShowCreateSharedLibraryDialog(false)} />
            </div>

        </PageWrapper>
    )
}

export default withAuth(withProfile((Libraries)))
