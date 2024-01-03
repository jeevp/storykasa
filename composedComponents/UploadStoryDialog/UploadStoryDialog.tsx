import React from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import {Books} from "@phosphor-icons/react";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
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
        <STKDialog title="Added to your library!" active={open} onClose={() => onClose()}>
            <div>
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
