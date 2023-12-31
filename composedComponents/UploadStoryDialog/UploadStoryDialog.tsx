import React from 'react';
import Link from "next/link"
import STKDialog from "@/components/STKDialog/STKDialog";
import {Books} from "@phosphor-icons/react";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import {useRouter} from "next/navigation";
import {green600} from "@/assets/colorPallet/colors";


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
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Congratulations on crafting your brand new story! If you’d like to share your story with friends and family, simply <Link href="/collections" className="font-semibold no-underline text-green-600">create a collection here</Link>. Feel free to explore this option whenever you're ready!
                </p>

                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    <div className="mt-2 lg:mt-0 w-full lg:w-auto">
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
