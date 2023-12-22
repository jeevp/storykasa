import { useEffect, useState} from 'react'
import PageWrapper from '@/composedComponents/PageWrapper'
import {Books} from '@phosphor-icons/react'
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import {green600} from "@/assets/colorPallet/colors";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";
import CreateSharedLibraryDialog from "@/composedComponents/CreateSharedLibraryDialog/CreateSharedLibraryDialog";
import LibraryCard from "@/composedComponents/LibraryCard/LibraryCard";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler";
import {useRouter} from "next/router";
import Library from "@/models/Library";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton"

function Libraries() {
    const router = useRouter()

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
        handleFetchSharedLibraries()
        handleFetchSharedLibraryInvitations()
    }, [])

    // Methods
    const handleFetchLibraries = async () => {
        setLoadingLibraries(true)
        await LibraryHandler.fetchLibraries(setLibraries)
        setLoadingLibraries(false)
    }

    const handleFetchSharedLibraries = async () => {
        setLoadingSharedLibraries(true)
        const _sharedLibraries = await LibraryHandler.fetchSharedLibraries()

        setSharedLibraries(_sharedLibraries)
        setLoadingSharedLibraries(false)
    }

    const handleFetchSharedLibraryInvitations = async () => {
        setLoadingSharedLibraryInvitations(true)
        const sharedLibraryInvitations = await SharedLibraryInvitationHandler.fetchSharedLibraryInvitations()
        // @ts-ignore
        setSharedLibraryInvitations(sharedLibraryInvitations)
        setLoadingSharedLibraryInvitations(false)
    }

    const goToLibrary = async (library: Library) => {
        await router.push({
            pathname: `/shared-libraries/${library.libraryId}`,
            query: {
                libraryName: library.libraryName
            }
        }, "", {
            shallow: true
        })
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
                            <div className="flex flex-wrap -mx-1 mt-4">
                                {[1,2,3,4,5,6].map((library, index) => (
                                    <div className="p-1 flex-1 min-w-[280px]" key={index}>
                                        <STKSkeleton height="222px" />
                                    </div>
                                ))}
                            </div>
                        ): !loadingSharedLibraryInvitations && sharedLibraryInvitations.length > 0 ? (
                            <div>
                                <label className="font-semibold">You have been invited to join the following libraries</label>
                                <div className="flex items-start flex-col lg:flex-row flex-wrap mt-4">
                                    {sharedLibraryInvitations.map((sharedLibraryInvitation, index) => (
                                        <div className="p-1" key={index}>
                                            <LibraryCard
                                                // @ts-ignore
                                                library={sharedLibraryInvitation?.library}
                                                // @ts-ignore
                                                sharedLibraryInvitation={sharedLibraryInvitation?.sharedLibraryInvitation}
                                                />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mt-2">
                        {loadingSharedLibraries ? (
                            <div className="flex flex-wrap -mx-1 mt-4">
                                {[1,2,3,4,5,6].map((library, index) => (
                                    <div className="p-1 flex-1 min-w-[280px]" key={index}>
                                        <STKSkeleton height="222px" />
                                    </div>
                                ))}
                            </div>
                        ) : !loadingSharedLibraries && sharedLibraries?.length > 0 ? (
                            <div>
                                <label className="font-semibold">Listening to</label>
                                {sharedLibraries?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 222px)" }}>
                                        <Books size={100} color={green600} />
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        <p className="max-w-md text-center">
                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                            Currently, you don't have any shared libraries. Create a new one and
                                            begin the exciting journey of sharing stories!
                                        </p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap -mx-1 mt-4">
                                        {sharedLibraries.map((sharedLibrary, index) => (
                                            <div className="p-1 flex-1 min-w-[280px]" key={index}>
                                                <LibraryCard
                                                    library={sharedLibrary}
                                                    onClick={() => goToLibrary(sharedLibrary)}/>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        ) : null}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="mt-2">
                        {loadingLibraries ? (
                                <div className="flex flex-wrap -mx-1 mt-4">
                                    {[1,2,3,4,5,6].map((library, index) => (
                                        <div className="p-1 flex-1 min-w-[280px]" key={index}>
                                            <STKSkeleton height="222px" />
                                        </div>
                                    ))}
                                </div>
                        ): (
                            <>
                                <label className="font-semibold">Your libraries</label>
                                {libraries?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 222px)" }}>
                                        <Books size={100} color={green600} />
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        <p className="max-w-md text-center">You don't have any shared library available. <br />Create one and start sharing stories</p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create shared library</STKButton>
                                        </div>
                                    </div>
                                ) : (

                                    <div className="flex flex-wrap -mx-1 mt-4">
                                        {libraries.map((library, index) => (
                                            <div className="p-1 flex-1 min-w-[280px]" key={index}>
                                                <LibraryCard
                                                    library={library}
                                                    enableAddListeners
                                                    onClick={() => goToLibrary(library)}/>
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
