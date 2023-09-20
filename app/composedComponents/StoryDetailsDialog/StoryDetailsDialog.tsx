import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import StoryDetails from "@/app/(home)/story-details";
import {Dialog} from "@radix-ui/themes";
import {StoryWithProfile} from "@/lib/database-helpers.types";
import useDevice from "@/app/customHooks/useDevice";


interface StoryDetailsDialogProps {
    open: boolean;
    story: StoryWithProfile | null;
    onClose?: () => void;
}

export default function StoryDetailsDialog({ open, story, onClose = () => ({}) }: StoryDetailsDialogProps) {
    const { onMobile } = useDevice()

    console.log({ story })
    return (
        <Dialog.Root open={open}>
            <Dialog.Content
            style={onMobile ? { borderRadius: 0 } : {}}
            className="h-full sm:h-auto top-0 sm:top-auto !max-h-full sm:max-h-auto fixed sm:block">
                <Dialog.Close>
                    <div className="flex justify-end">
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