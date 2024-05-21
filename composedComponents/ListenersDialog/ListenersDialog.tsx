import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import AddMemberToList from "@/composedComponents/AddMemberToList/AddMemberToList"
import LibraryHandler from "@/handlers/LibraryHandler";
import Library from "@/models/Library";
import ListenersInvitationSummary from "@/composedComponents/ListenersInvitationSummary/ListenersInvitationSummary";
import {useProfile} from "@/contexts/profile/ProfileContext";
import CollectionListeners from "@/composedComponents/CollectionListeners/CollectionListeners";


interface AddListenerDialogProps {
    open: boolean;
    library: Library | null
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function ListenersDialog({
    open,
    library,
    onClose = () => ({}),
    onSuccess = () => ({})
}: AddListenerDialogProps) {
    const { onMobile } = useDevice()

    // Contexts
    const { currentProfileId } = useProfile()

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [listenersEmails, setListenersEmails] = useState<string[]>([])

    useEffect(() => {
        resetState()
    }, []);

    // Methods
    const handleSave = async () => {
        try {
            setLoading(true)

            const _invitations = await LibraryHandler.addListenerToLibrary({
                libraryId: library?.libraryId || "",
            }, { listenersEmails, profileId: currentProfileId })

            // @ts-ignore
            setCollectionInvitations(_invitations)

            onSuccess()
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        resetState()
    }

    const resetState = () => {
        setListenersEmails([])
    }

    return (
        <STKDialog
        active={open}
        maxWidth="sm"
        title="Listeners"
        fullScreen={onMobile}
        onClose={handleClose}>
            <div className="mt-6">
                <CollectionListeners library={library} onClose={() => onClose()} />
            </div>
            <STKSnackbar
            open={showSnackbar}
            message="Story updated with success"
            onClose={() => setShowSnackbar(false)} />
        </STKDialog>
    )
}
