import STKCard from "@/components/STKCard/STKCard";
import {Books} from "@phosphor-icons/react";
import Library from "@/models/Library";
import ListenerAvatars from "@/composedComponents/ListenersAvatars/ListenersAvatars";
import STKButton from "@/components/STKButton/STKButton";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler"
import {useEffect, useState} from "react";
import AddListenerDialog from "@/composedComponents/AddListenerDialog/AddListenerDialog"
import STKMenu from "@/components/STKMenu/STKMenu";
import libraries from "@/pages/api/libraries";
import {useLibrary} from "@/contexts/library/LibraryContext";


export default function LibraryCard({ library, sharedLibraryInvitation, enableAddListeners, onClick = () => ({}) }: {
    library: Library,
    sharedLibraryInvitation?: SharedLibraryInvitation,
    enableAddListeners?: boolean,
    onClick?: () => void
}) {
    const [internalSharedLibraryInvitation, setInternalSharedLibraryInvitation] = useState<SharedLibraryInvitation | null>(null)
    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingReject, setLoadingReject] = useState(false)
    const [showAddListenerDialog, setShowAddListenerDialog] = useState(false)

    const {
        sharedLibraries,
        setSharedLibraries,
        setSharedLibraryInvitations,
        sharedLibraryInvitations
    } = useLibrary()

    useEffect(() => {
        if (sharedLibraryInvitation) {
            setInternalSharedLibraryInvitation(sharedLibraryInvitation)
        }
    }, [sharedLibraryInvitation]);

    const handleAcceptSharedLibraryInvitation = async () => {
        setLoadingAccept(true)

        await SharedLibraryInvitationHandler.updateSharedLibraryInvitation({
            // @ts-ignore
            sharedLibraryInvitationId: sharedLibraryInvitation.id
        }, {
            accept: true
        })

        // @ts-ignore
        setSharedLibraries([ ...sharedLibraries, library])

        setSharedLibraryInvitations(
            // @ts-ignore
            sharedLibraryInvitations.filter((invitation) => {
                // @ts-ignore
                return invitation.sharedLibraryInvitation.id !== internalSharedLibraryInvitation?.id
            })
        )

        // @ts-ignore
        setInternalSharedLibraryInvitation(new SharedLibraryInvitation({
            ...internalSharedLibraryInvitation,
            accept: true
        }))

        setLoadingAccept(false)
    }

    const handleRejectSharedLibraryInvitation = async () => {
        setLoadingReject(true)
        await SharedLibraryInvitationHandler.updateSharedLibraryInvitation({
            // @ts-ignore
            sharedLibraryInvitationId: sharedLibraryInvitation.id
        }, {
            accept: false
        })

        setInternalSharedLibraryInvitation(
            // @ts-ignore
            new SharedLibraryInvitation({
                ...internalSharedLibraryInvitation,
                accept: false
            })
        )

        setLoadingReject(false)
    }

    return (
        <div className={`cursor-pointer`}>
            <STKCard>
                <div className="flex items-center  justify-center flex-col p-2 w-42 " onClick={() => onClick()}>
                    <div className="flex items-center flex-col p-6">
                        <div>
                            <Books size={50} color="#ccc" />
                        </div>
                        <div className="flex items-center flex-col">
                            <div className="overflow-hidden max-w-[160px] text-ellipsis">
                                <label className="font-semibold text-center whitespace-nowrap">{library.libraryName}</label>
                            </div>
                            <div className="mt-2">
                                {!library.totalStories}
                                <label>
                                    {library.totalStories !== 1 ? `${library.totalStories } stories` : '1 story'}
                                </label>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ListenerAvatars avatars={library?.listeners} />
                        </div>
                    </div>

                    {internalSharedLibraryInvitation ? (
                        <div className="flex items-center justify-betwee pb-4 mt-8">
                            <div>
                                <STKButton
                                variant="outlined"
                                onClick={handleRejectSharedLibraryInvitation} loading={loadingReject}>Reject</STKButton>
                            </div>
                            <div className="ml-2">
                                <STKButton onClick={handleAcceptSharedLibraryInvitation} loading={loadingAccept}>Accept</STKButton>
                            </div>
                        </div>
                    ) : enableAddListeners ? (
                        <div className="mt-5 flex justify-end w-full items-baseline">
                            <STKMenu options={[
                                { label: "Add listener", value: 0 },
                            ]} onChange={() => setShowAddListenerDialog(true)}/>
                        </div>
                    ) : null}
                </div>
            </STKCard>
            <AddListenerDialog
            library={library}
            open={showAddListenerDialog}
            onClose={() => setShowAddListenerDialog(false)} />
        </div>
    )
}
