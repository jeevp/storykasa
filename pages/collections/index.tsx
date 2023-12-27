import { useEffect, useState} from 'react'
import PageWrapper from '@/composedComponents/PageWrapper'
import {Books} from '@phosphor-icons/react'
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import {green600} from "@/assets/colorPallet/colors";
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
import STKButton from "@/components/STKButton/STKButton";
import CreateCollectionDialog from "@/composedComponents/CreateCollectionDialog/CreateCollectionDialog";
import LibraryCard from "@/composedComponents/LibraryCard/LibraryCard";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler";
import {useRouter} from "next/router";
import Library from "@/models/Library";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton"
import useDevice from "@/customHooks/useDevice";

function Collections() {
    const router = useRouter()

    const { onMobile } = useDevice()

    // Contexts
    const {
        libraries,
        setLibraries,
        sharedLibraries,
        setSharedLibraries,
        sharedLibraryInvitations,
        setSharedLibraryInvitations,
        setCurrentLibrary
    } = useLibrary()

    const startLoading = (
        libraries.length === 0
        && sharedLibraries.length === 0
        && sharedLibraryInvitations.length === 0
    )

    // States
    const [loadingSharedLibraries, setLoadingSharedLibraries] = useState(startLoading)
    const [loadingLibraries, setLoadingLibraries] = useState(startLoading)
    const [loadingSharedLibraryInvitations, setLoadingSharedLibraryInvitations] = useState(startLoading)
    const [showCreateSharedLibraryDialog, setShowCreateSharedLibraryDialog] = useState(false)

    // Mounted
    useEffect(() => {
        handleFetchLibraries()
        handleFetchSharedLibraries()
        handleFetchSharedLibraryInvitations()
    }, [])

    // Methods
    const handleFetchLibraries = async () => {
        setLoadingLibraries(startLoading)
        await LibraryHandler.fetchLibraries(setLibraries)
        setLoadingLibraries(false)
    }

    const handleFetchSharedLibraries = async () => {
        setLoadingSharedLibraries(startLoading)
        const _sharedLibraries = await LibraryHandler.fetchSharedLibraries()

        setSharedLibraries(_sharedLibraries)
        setLoadingSharedLibraries(false)
    }

    const handleFetchSharedLibraryInvitations = async () => {
        setLoadingSharedLibraryInvitations(startLoading)
        const sharedLibraryInvitations = await SharedLibraryInvitationHandler.fetchSharedLibraryInvitations()
        // @ts-ignore
        setSharedLibraryInvitations(sharedLibraryInvitations)
        setLoadingSharedLibraryInvitations(false)
    }

    const goToLibrary = async (library: Library) => {
        // @ts-ignore
        setCurrentLibrary(library)
        await router.push({
            pathname: `/collections/${library.libraryId}`,
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
                        Collections
                    </h2>
                </div>
                <div className="mt-4 flex flex-col lg:flex-row justify-between w-full items-center">
                    <p className="max-w-xl">
                       Collections are groups of stories. Organize stories in your own collections, or create shared
                        collections to collaborate with friends and family
                    </p>
                    {libraries.length > 0 && (
                        <div className="mt-4 lg:mt-0 w-full lg:w-auto">
                            <STKButton fullWidth={onMobile} onClick={() => setShowCreateSharedLibraryDialog(true)}>Create collection</STKButton>
                        </div>
                    )}
                </div>
                <div className="mt-10">
                    <div className="mt-2">
                        {loadingSharedLibraryInvitations ? (
                            <div className="flex flex-wrap -mx-1 mt-4">
                                {[1,2,3,4].map((library, index) => (
                                    <div className="p-3 lg:w-[320px] w-full" key={index}>
                                        <STKSkeleton height="94px" />
                                    </div>
                                ))}
                            </div>
                        ): !loadingSharedLibraryInvitations && sharedLibraryInvitations.length > 0 ? (
                            <div>
                                <label className="font-semibold">You have been invited to join the following collections</label>
                                <div className="flex items-start flex-col lg:flex-row flex-wrap mt-4">
                                    {sharedLibraryInvitations.map((sharedLibraryInvitation, index) => (
                                        <div className="p-1 lg:w-[320px] w-full" key={index}>
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
                        {loadingLibraries ? (
                            <div className="flex flex-wrap -mx-1 mt-4">
                                {[1,2,3,4].map((library, index) => (
                                    <div className="p-3 lg:w-[320px] w-full" key={index}>
                                        <STKSkeleton height="94px" />
                                    </div>
                                ))}
                            </div>
                        ): (
                            <>
                                <label className="font-semibold">Your collections</label>
                                {libraries?.length === 0 ? (
                                    <div className="flex flex-col mt-4">
                                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                                        <p className="max-w-lg">
                                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                                            At the moment, you don't have any collection set up. Why not create one? It's a great way to start sharing stories and experiences!
                                        </p>
                                        <div className="mt-6">
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create collection</STKButton>
                                        </div>
                                    </div>
                                ) : (

                                    <div className="flex flex-wrap -mx-1 mt-4">
                                        {libraries.map((library, index) => (
                                            <div className="p-3 lg:w-[320px] w-full" key={index}>
                                                <LibraryCard
                                                    showListeners
                                                    library={library}
                                                    onClick={() => goToLibrary(library)}/>
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
                            <div className="flex flex-wrap -mx-1 mt-4">
                                {[1,2,3,4].map((library, index) => (
                                    <div className="p-3 lg:w-[320px] w-full" key={index}>
                                        <STKSkeleton height="94px" />
                                    </div>
                                ))}
                            </div>
                        ) : !loadingSharedLibraries && sharedLibraries?.length > 0 ? (
                            <div>
                                <label className="font-semibold">Shared collections</label>
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
                                            <STKButton onClick={() => setShowCreateSharedLibraryDialog(true)}>Create collection</STKButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap -mx-1 mt-4">
                                        {sharedLibraries.map((sharedLibrary, index) => (
                                            <div className="p-3 lg:w-[320px] w-full" key={index}>
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

                <CreateCollectionDialog
                open={showCreateSharedLibraryDialog}
                onClose={() => setShowCreateSharedLibraryDialog(false)} />
            </div>

        </PageWrapper>
    )
}

export default withAuth(withProfile((Collections)))
