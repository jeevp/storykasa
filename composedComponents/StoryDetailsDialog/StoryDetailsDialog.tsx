import React from 'react';
import StoryDetails from "@/composedComponents/StoryDetails/StoryDetails";
import STKDialog from "@/components/STKDialog/STKDialog";
import Story from "@/models/Story";


interface StoryDetailsDialogProps {
    open: boolean;
    story: Story | null;
    editionNotAllowed?: boolean;
    onClose?: () => void;
}

export default function StoryDetailsDialog({
    open,
    editionNotAllowed,
    story,
    onClose = () => ({}),
}: StoryDetailsDialogProps) {
    return (
        <STKDialog
        fullScreen
        active={open}
        onClose={() => onClose()}>
            <StoryDetails
            editionNotAllowed={editionNotAllowed}
            story={story} />
        </STKDialog>
    )
}
