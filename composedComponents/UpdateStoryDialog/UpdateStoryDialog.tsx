import React, {useContext, useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import {useRouter} from "next/navigation";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import SnackbarContext from "@/contexts/SnackbarContext";


interface DeleteStoryDialogProps {
    open: boolean;
    story: any;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function UpdateStoryDialog({
    open,
    story,
    onClose = () => ({}),
    onSuccess = () => ({})
}: DeleteStoryDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useContext(SnackbarContext)

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    // Watchers
    useEffect(() => {
        if (story) {
            setTitle(story?.title)
            setDescription(story?.description)
        }
    }, [story]);

    // Methods
    const handleOnChange = (key: string, value: string) => {
        if (key === "title") setTitle(value)
        if (key === "description") setDescription(value)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            await StoryHandler.updateStory({ storyId: story.story_id }, {
                title,
                description
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
                    {story?.title}
                </h2>
                <div className="mt-6">
                    <div>
                        <label className="font-semibold">Title</label>
                        <div className="mt-2">
                            <STKTextField
                            fluid
                            value={title}
                            placeholder="Type the story title"
                            onChange={(value: string) => handleOnChange("title", value)}/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="font-semibold">Description</label>
                        <div className="mt-2">
                            <STKTextField
                            fluid
                            multiline
                            value={description}
                            maxRows={20}
                            placeholder="Type the story description"
                            onChange={(value: string) => handleOnChange("description", value)}/>
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