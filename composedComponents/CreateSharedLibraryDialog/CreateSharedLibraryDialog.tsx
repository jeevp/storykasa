import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import AddMemberToList from "@/composedComponents/AddMemberToList/AddMemberToList"
import LibraryHandler from "@/handlers/LibraryHandler";
import sharedLibraries from "@/pages/shared-libraries";
import {useLibrary} from "@/contexts/library/LibraryContext";


interface CreateSharedLibraryDialogProps {
    open: boolean;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function CreateSharedLibraryDialog({
    open,
    onClose = () => ({}),
    onSuccess = () => ({})
}: CreateSharedLibraryDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [libraryName, setLibraryName] = useState("")
    const [listenersEmails, setListenersEmails] = useState<string[]>([])

    // Contexts
    const { sharedLibraries, setSharedLibraries } = useLibrary()

    // Methods
    const handleSave = async () => {
        try {
            setLoading(true)

            const library = await LibraryHandler.createSharedLibrary({
                libraryName,
                listenersEmails
            })

            setSharedLibraries([...sharedLibraries, library])

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
        title="Create shared library"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Library title</label>
                        <div className="mt-2">
                            <STKTextField
                            fluid
                            value={libraryName}
                            placeholder="Type the story title"
                            onChange={(value: string) => setLibraryName(value)}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="font-semibold">Listeners</label>
                        <p className="mt-2">Bellow you can enter the email of your friends and family who you which to share this library with.</p>
                        <div className="mt-4">
                            <AddMemberToList onChange={(emails: string[]) => setListenersEmails(emails)} />
                        </div>
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
