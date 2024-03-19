import * as React from 'react';
import { Dialog } from '@mui/material';
import STKButton from "@/components/STKButton/STKButton";
import { X } from '@phosphor-icons/react'
import {neutral800} from "@/assets/colorPallet/colors";
import {ArrowBack} from "@mui/icons-material";

interface STKDialogProps {
    active: boolean
    children: any
    title?: string
    fullScreen?: boolean
    aiMode?: boolean
    persist?: boolean
    animationDirection?: "right" | "left" | "up" | "down"
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
    includeBackArrow?: boolean,
    onBack?: (e: MouseEvent) => void
    onClose: (e: MouseEvent) => void
}

export default function STKDialog({
    active,
    fullScreen,
    children,
    aiMode,
    title,
    persist,
    maxWidth,
    includeBackArrow,
    onClose = (e: MouseEvent) => (e),
    onBack = (e: MouseEvent) => (e)
}: STKDialogProps) {

    const handleClose = (e: MouseEvent) => {
        if (persist) return
        onClose(e)
    }


    return (
        <Dialog
            open={active}
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            fullWidth={!!maxWidth}
            onClose={handleClose}
        >
            <div className="p-4 lg:p-6" style={{ border: aiMode ? `2px solid #8f65d9` : '' }}>
                <div className="flex items=center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {includeBackArrow && (
                                // @ts-ignore
                                <STKButton iconButton onClick={() => onBack()}><ArrowBack /></STKButton>
                            )}
                            <div>
                                {title && (
                                    <label className="font-bold text-lg">{title}</label>
                                )}
                            </div>
                        </div>

                    </div>
                    {!persist && (
                        <div>
                            <STKButton iconButton onClick={handleClose}>
                                <X size={20} color={neutral800} />
                            </STKButton>
                        </div>
                    )}
                </div>
                <div>
                    {children}
                </div>
            </div>
        </Dialog>
    );
}
