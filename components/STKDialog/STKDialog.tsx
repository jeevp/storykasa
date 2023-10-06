import * as React from 'react';
import { Dialog } from '@mui/material';
import STKButton from "@/components/STKButton/STKButton";
import { X } from '@phosphor-icons/react'
import {neutral800} from "@/assets/colorPallet/colors";

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
                    <div className="absolute">
                        <STKButton iconButton onClick={() => onClose()}>
                            <X size={20} color={neutral800} />
                        </STKButton>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}
