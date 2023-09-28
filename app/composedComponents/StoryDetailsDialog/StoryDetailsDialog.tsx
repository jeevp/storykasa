import React from 'react';
import StoryDetails from "@/app/(home)/story-details";
import {StoryWithProfile} from "@/lib/database-helpers.types";
import STKDialog from "@/app/components/STKDialog/STKDialog";


interface StoryDetailsDialogProps {
    open: boolean;
    story: StoryWithProfile | null;
    onClose?: () => void;
}

export default function StoryDetailsDialog({ open, story, onClose = () => ({}) }: StoryDetailsDialogProps) {
    return (
        <STKDialog fullScreen active={open} onClose={() => onClose()}>
            <StoryDetails story={story} />
        </STKDialog>
    )
}
