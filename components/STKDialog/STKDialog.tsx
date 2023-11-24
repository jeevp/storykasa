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
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
    onClose: (e: MouseEvent) => void
}

export default function STKDialog({
    active,
    fullScreen,
    children,
    maxWidth,
    onClose = (e: MouseEvent) => (e)
}: STKDialogProps) {

    return (
        <Dialog
            open={active}
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            fullWidth={!!maxWidth}
            onClose={(e: MouseEvent) => onClose(e)}
        >
            <div className="p-4">
                <div className="flex justify-end">
                    <div className="absolute">
                        <STKButton iconButton onClick={(e: MouseEvent) => onClose(e)}>
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
