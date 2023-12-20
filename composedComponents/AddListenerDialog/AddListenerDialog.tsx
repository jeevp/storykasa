import React, {useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import AddMemberToList from "@/composedComponents/AddMemberToList/AddMemberToList"
import LibraryHandler from "@/handlers/LibraryHandler";
import {useLibrary} from "@/contexts/library/LibraryContext";
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

    // Contexts
    const { libraries, setLibraries } = useLibrary()

    // Methods
    const handleSave = async () => {
        try {
            setLoading(true)

            const _library = await LibraryHandler.addListenerToLibrary({
                libraryId: library.libraryId,
            }, { listenersEmails })


            setSnackbarBus({
                active: true,
                message: "Story updated with success",
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
        title="Add Listeners to library"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <p className="mt-2">Bellow you can enter the email of your friends and family who you which to share this library with.</p>
                    <div className="mt-4">
                        <AddMemberToList onChange={(emails: string[]) => setListenersEmails(emails)} />
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
