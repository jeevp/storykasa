import React, {useState} from 'react';
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

    // Methods
    const handleSave = async () => {
        try {
            setLoading(true)

            const _library = await LibraryHandler.addListenerToLibrary({
                libraryId: library.libraryId,
            }, { listenersEmails })


            setSnackbarBus({
                active: true,
                message: "Listener added to collection with success",
                type: "success"
            })

            onSuccess()
            onClose()
        } finally {
            setLoading(false)
        }
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
                        <AddMemberToList members={library?.listeners} onChange={(emails: string[]) => setListenersEmails(emails)} />
                    </div>
                </div>
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
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
                            Save
                        </STKButton>
                    </div>
                </div>
            </div>
            <STKSnackbar
            open={showSnackbar}
            message="Story updated with success"
            onClose={() => setShowSnackbar(false)} />
        </STKDialog>
    )
}
