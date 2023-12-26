import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import AddMemberToList from "@/composedComponents/AddMemberToList/AddMemberToList"
import LibraryHandler from "@/handlers/LibraryHandler";
import Library from "@/models/Library";


interface AddListenerDialogProps {
    open: boolean;
    library: Library
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function AddListenerDialog({
    open,
    library,
    onClose = () => ({}),
    onSuccess = () => ({})
}: AddListenerDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [listenersEmails, setListenersEmails] = useState<string[]>([])
    const [collectionInvitations, setCollectionInvitations] = useState([])

    useEffect(() => {
        setCollectionInvitations([])
        setListenersEmails([])
    }, []);

    // Methods
    const handleSave = async () => {
        try {
            setLoading(true)

            const _invitations = await LibraryHandler.addListenerToLibrary({
                libraryId: library?.libraryId,
            }, { listenersEmails })

            // @ts-ignore
            setCollectionInvitations(_invitations)

            onSuccess()
        } finally {
            setLoading(false)
        }
    }

    const handleOnChange = (emails: string[]) => {
        setListenersEmails(emails)
        // @ts-ignore
        setCollectionInvitations(collectionInvitations.filter((invitation) => emails.includes(invitation.listenerEmail)))
    }

    return (
        <STKDialog
        active={open}
        maxWidth="xs"
        title="Add Listeners to collection"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <p className="mt-2 text-sm">
                       You have the option to invite friends and family to join your collection. Simply enter
                        their email addresses to send them an invitation. Upon accepting, they will be added as
                        listeners, granting them access to enjoy the stories alongside you.
                    </p>
                    <div className="mt-4">
                        <AddMemberToList
                        // @ts-ignore
                        collectionInvitations={collectionInvitations}
                        members={library?.listeners}
                        onChange={handleOnChange} />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    {listenersEmails?.length === collectionInvitations?.length && collectionInvitations.length > 0 ? (
                        <div className="w-full lg:w-auto">
                            <STKButton fullWidth={onMobile} onClick={() => onClose()}>
                                Done
                            </STKButton>
                        </div>
                    ) : (
                        <>
                            <div className="w-full lg:w-auto">
                                <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                                    Cancel
                                </STKButton>
                            </div>
                            <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                                <STKButton
                                    fullWidth={onMobile}
                                    color="primary"
                                    disabled={listenersEmails.length === 0}
                                    loading={loading}
                                    onClick={handleSave}>
                                    Invite
                                </STKButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <STKSnackbar
            open={showSnackbar}
            message="Story updated with success"
            onClose={() => setShowSnackbar(false)} />
        </STKDialog>
    )
}
