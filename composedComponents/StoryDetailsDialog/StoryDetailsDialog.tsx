import React from 'react';
import StoryDetails from "@/composedComponents/StoryDetails/StoryDetails";
import {StoryWithProfile} from "@/lib/database-helpers.types";
import STKDialog from "@/components/STKDialog/STKDialog";


interface StoryDetailsDialogProps {
    open: boolean;
    story: StoryWithProfile | null;
    editionNotAllowed?: boolean;
    onClose?: () => void;
    onLoadStories?: () => void;
}

export default function StoryDetailsDialog({
    open,
    editionNotAllowed,
    story,
    onClose = () => ({}),
    onLoadStories = () => ({})
}: StoryDetailsDialogProps) {
    return (
        <STKDialog
        fullScreen
        active={open}
        onClose={() => onClose()}>
            <StoryDetails
            editionNotAllowed={editionNotAllowed}
            story={story}
            onLoadStories={() => onLoadStories()} />
        </STKDialog>
    )
}
