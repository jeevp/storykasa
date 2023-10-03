import React from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";


interface FeedbackDialogProps {
    open: boolean;
    children?: any;
    title?: string;
    text?: string;
    actionButtonText?: string;
    loading?: boolean;
    onClose?: () => void;
    onAction?: () => void;
    actionButtonStartIcon?: () => void;
}

export default function FeedbackDialog({
    open,
    title,
    text,
    actionButtonStartIcon = () => ({}),
    actionButtonText,
    onAction = () => ({}),
    loading,
    onClose = () => ({})
}: FeedbackDialogProps) {
    const { onMobile } = useDevice()


    return (
        <STKDialog active={open} onClose={() => onClose()}>
            <div>
                <h2 className="text-xl font-bold">
                    {title}
                </h2>
                <p className="mt-4">
                    {text}
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
                            loading={loading}
                            startIcon={actionButtonStartIcon}
                            onClick={() => onAction()}>
                            {actionButtonText}
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
