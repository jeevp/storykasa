import STKCard from "@/components/STKCard/STKCard";
import {Books} from "@phosphor-icons/react";
import Library from "@/models/Library";
import STKButton from "@/components/STKButton/STKButton";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler"
import {useEffect, useState} from "react";
import AddListenerDialog from "@/composedComponents/AddListenerDialog/AddListenerDialog"
import {useLibrary} from "@/contexts/library/LibraryContext";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import {green600} from "@/assets/colorPallet/colors";

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
                <div className="flex px-4 py-6 justify-center flex-col w-42 " onClick={() => onClick()}>
                    <div className="flex items-center h-full">
                        <div>
                            <Books size={30} color="#ccc" />
                        </div>
                        <div className="flex flex-col ml-4">
                            <div className="overflow-hidden max-w-[160px] text-ellipsis">
                                <label className="font-semibold whitespace-nowrap">{library.libraryName}</label>
                            </div>
                            <div className="mt-1 flex items-center">
                                <div>
                                    {!library.totalStories}
                                    <label>
                                        {library.totalStories !== 1 ? `${library.totalStories || 0 } stories` : '1 story'}
                                    </label>
                                </div>
                                <div className="ml-4">
                                    <label>
                                        {Math.ceil(library?.totalDuration / 60)} min
                                    </label>
                                </div>
                            </div>
                            {library?.listeners?.length > 0 && (
                                <div className="mt-2 flex items-center">
                                    <PeopleAltOutlinedIcon sx={{ color: green600, width: "16px", height: "16px"  }}/>
                                    <label className="ml-2 text-sm text-[#3d996d]">Shared with {library?.listeners?.length} listeners</label>
                                </div>
                            )}
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
