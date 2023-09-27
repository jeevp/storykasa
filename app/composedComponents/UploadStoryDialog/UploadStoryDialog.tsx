import React from 'react';
import {StoryWithProfile} from "@/lib/database-helpers.types";
import STKDialog from "@/app/components/STKDialog/STKDialog";
import {Books} from "@phosphor-icons/react";
import STKButton from "@/app/components/STKButton/STKButton";
import useDevice from "@/app/customHooks/useDevice";
import {useRouter} from "next/navigation";


interface UploadStoryDialogProps {
    open: boolean;
    onClose?: () => void;
}

export default function UploadStoryDialog({ open, onClose = () => ({}) }: UploadStoryDialogProps) {
    const { onMobile } = useDevice()
    const router = useRouter()

    // Methods
    const handleGoToLibrary = async () => {
        await router.push('/library')
    }

    return (
        <STKDialog active={open} onClose={() => onClose()}>
            <div>
                <h2 className="text-xl font-bold">
                    Added to your library!
                </h2>
                <p className="mt-4">
                    Congratulations on your brand new story. Go to your library
                    to listen to it.
                </p>
                <div className="mt-8 flex items-center flex-col lg:flex-row">
                    <div className="w-full lg:w-auto">
                        <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                            Cancel
                        </STKButton>
                    </div>
                    <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                            fullWidth={onMobile}
                            color="primary"
                            startIcon={<Books size="20" />}
                            onClick={handleGoToLibrary}>
                            Go to my library
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
