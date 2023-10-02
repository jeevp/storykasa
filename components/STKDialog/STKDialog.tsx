import * as React from 'react';
import { Dialog } from '@mui/material';
import STKButton from "@/components/STKButton/STKButton";

interface STKDialogProps {
    active: boolean
    children: any,
    fullScreen?: boolean
    animationDirection?: "right" | "left" | "up" | "down"
    onClose: () => void
}

export default function STKDialog({
    active,
    fullScreen,
    children,
    onClose = () => ({})
}: STKDialogProps) {

    return (
        <Dialog
            open={active}
            fullScreen={fullScreen}
            onClose={() => onClose()}
        >
            <div className="p-4">
                <div className="flex justify-end">
                    <STKButton onClick={() => onClose()}>
                        fechar
                        {/*<Cross2Icon />*/}
                    </STKButton>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}
