import STKCard from "@/components/STKCard/STKCard";
import {Books} from "@phosphor-icons/react";
import Library from "@/models/Library";
import ListenerAvatars from "@/composedComponents/ListenersAvatars/ListenersAvatars";
import STKButton from "@/components/STKButton/STKButton";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import SharedLibraryInvitationHandler from "@/handlers/SharedLibraryInvitationHandler"
import {useEffect, useState} from "react";


export default function LibraryCard({ library, sharedLibraryInvitation }: {
    library: Library,
    sharedLibraryInvitation: SharedLibraryInvitation
}) {
    const [internalSharedLibraryInvitation, setInternalSharedLibraryInvitation] = useState<SharedLibraryInvitation | null>(null)
    const [loadingAccept, setLoadingAccept] = useState(false)
    const [loadingReject, setLoadingReject] = useState(false)

    useEffect(() => {
        if (sharedLibraryInvitation) {
            setInternalSharedLibraryInvitation(sharedLibraryInvitation)
        }
    }, [sharedLibraryInvitation]);

    const handleAcceptSharedLibraryInvitation = async () => {
        setLoadingAccept(true)

        await SharedLibraryInvitationHandler.updateSharedLibraryInvitation({
            sharedLibraryInvitationId: sharedLibraryInvitation.id
        }, {
            accept: true
        })

        setInternalSharedLibraryInvitation(new SharedLibraryInvitation({
            ...internalSharedLibraryInvitation,
            accept: true
        }))

        setLoadingAccept(false)
    }

    const handleRejectSharedLibraryInvitation = async () => {
        setLoadingReject(true)
        await SharedLibraryInvitationHandler.updateSharedLibraryInvitation({
            sharedLibraryInvitationId: sharedLibraryInvitation.id
        }, {
            accept: false
        })

        setInternalSharedLibraryInvitation(new SharedLibraryInvitation({
            ...internalSharedLibraryInvitation,
            accept: false
        }))

        setLoadingReject(false)
    }

    return (
        <div className={`${internalSharedLibraryInvitation && internalSharedLibraryInvitation.accept ? 'cursor-pointer' : ''}`}>
            <STKCard>
                <div className="flex items-center flex-col p-10 w-56 h-auto">
                    <div className="flex items-center flex-col">
                        <div>
                            <Books size={50} color="#ccc" />
                        </div>
                        <div className="flex items-center flex-col">
                            <div className="overflow-hidden max-w-[200px] text-ellipsis">
                                <label className="font-semibold text-center whitespace-nowrap">{library.libraryName}</label>
                            </div>
                            <div className="mt-2">
                                {!library.totalStories}
                                <label>
                                    {library.totalStories ? `${library.totalStories } stories` : "Without stories"}
                                </label>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ListenerAvatars avatars={library?.listeners} />
                        </div>
                    </div>

                    {internalSharedLibraryInvitation && (
                        <div className="flex items-center justify-betwee mt-8">
                            <div>
                                <STKButton
                                variant="outlined"
                                onClick={handleRejectSharedLibraryInvitation} loading={loadingReject}>Reject</STKButton>
                            </div>
                            <div className="ml-2">
                                <STKButton onClick={handleAcceptSharedLibraryInvitation} loading={loadingAccept}>Accept</STKButton>
                            </div>
                        </div>
                    )}
                </div>
            </STKCard>
        </div>
    )
}
