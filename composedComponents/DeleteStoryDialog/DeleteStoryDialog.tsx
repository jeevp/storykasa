import React, {useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {useStory} from "@/contexts/story/StoryContext";


interface DeleteStoryDialogProps {
    open: boolean;
    story: any;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function DeleteStoryDialog({
    open,
    story,
    onClose = () => ({}),
    onSuccess = () => ({})
}: DeleteStoryDialogProps) {
    const { setSnackbarBus } = useSnackbar()
    const { onMobile } = useDevice()

    const [loading, setLoading] = useState(false)

    // Contexts
    const { privateStories, setPrivateStories } = useStory()

    // Methods
    const handleDeleteStory = async () => {
        if (story) {
            try {
                setLoading(true)
                await StoryHandler.deleteStory(story?.storyId)
                setSnackbarBus({
                    active: true,
                    message: "Story deleted with success",
                    type: "success"
                })

                const _privateStories = privateStories.filter((_story) => {
                    // @ts-ignore
                    return _story?.storyId !== story?.storyId
                })

                // @ts-ignore
                setPrivateStories(_privateStories)

                onSuccess()
                onClose()
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <STKDialog title="Delete story" active={open} onClose={() => onClose()}>
            <div>
                <p className="mt-4">
                    Are you sure you want to delete <span className="font-semibold">&ldquo;{story?.title}&rdquo;?</span> ? Deleting a story is
                    permanent and cannot be undone.
                </p>
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
                        startIcon={<Trash size={20} />}
                        loading={loading}
                        onClick={handleDeleteStory}>
                            Yes, delete story
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
