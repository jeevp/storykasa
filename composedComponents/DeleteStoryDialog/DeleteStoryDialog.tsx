import React, {useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import {deleteStory} from "@/lib/_actions";
import {useRouter} from "next/navigation";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";


interface DeleteStoryDialogProps {
    open: boolean;
    story: any;
    onClose?: () => void;
}

export default function DeleteStoryDialog({ open, story, onClose = () => ({}) }: DeleteStoryDialogProps) {
    const router = useRouter()
    const { onMobile } = useDevice()

    const [loading, setLoading] = useState(false)

    // Methods
    const handleDeleteStory = async () => {
        if (story) {
            try {
                setLoading(true)
                await StoryHandler.deleteStory(story?.story_id)
                await router.push('/')
            } finally {
                setLoading(false)
            }
        }
    }


    return (
        <STKDialog active={open} onClose={() => onClose()}>
            <div>
                <h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap" style={{ maxWidth: "87%" }}>
                    Delete &ldquo;{story?.title}&rdquo;?
                </h2>
                <p className="mt-4">
                    Are you sure you want to delete this story? Deleting a story is
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
