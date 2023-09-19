import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import StoryDetails from "@/app/(home)/story-details";
import {Dialog} from "@radix-ui/themes";
import {StoryWithProfile} from "@/lib/database-helpers.types";


interface StoryDetailsDialogProps {
    open: boolean;
    story: StoryWithProfile;
    onClose?: () => void;
}
export default function StoryDetailsDialog({ open, story, onClose = () => ({}) }: StoryDetailsDialogProps) {

    return (
        <Dialog.Root open={open}>
            <Dialog.Content style={{ height: "100%", top: "0", borderRadius: "0", maxHeight: "100%", position: "fixed" }}>
                <Dialog.Close>
                    <div className="flex" style={{ justifyContent: "flex-end" }}>
                        <button className="IconButton" aria-label="Close" onClick={() => onClose()}>
                            <Cross2Icon />
                        </button>
                    </div>
                </Dialog.Close>
                <StoryDetails story={story} />
            </Dialog.Content>
        </Dialog.Root>
    )
}