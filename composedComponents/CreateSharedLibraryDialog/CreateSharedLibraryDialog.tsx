import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";


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
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [narratorName, setNarratorName] = useState("")


    // Methods
    const handleOnChange = () => {

    }

    const handleSave = async () => {
        try {
            setLoading(true)
            await StoryHandler.updateStory({ storyId: story.storyId }, {
                title,
                description,
                narratorName
            })

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
        maxWidth="sm"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap" style={{ maxWidth: "87%" }}>
                    Create shared library
                </h2>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Library title</label>
                        <div className="mt-2">
                            <STKTextField
                            fluid
                            value={title}
                            placeholder="Type the story title"
                            onChange={(value: string) => handleOnChange("title", value)}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="font-semibold">Listeners</label>
                        <div className="mt-2">
                            <STKTextField
                                fluid
                                value={narratorName}
                                placeholder="Type the narrator name"
                                onChange={(value: string) => handleOnChange("narratorName", value)}/>
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
