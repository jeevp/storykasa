import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {ThemeProvider} from "@mui/material";
import theme from "@/app/components/theme";

interface STKDialogProps {
    active: boolean
    children: any,
    fullScreen?: boolean
    animationDirection?: "right" | "left" | "up" | "down"
    onClose: Function
}

export default function STKDialog({
    active,
    fullScreen,
    children,
    onClose = () => ({})
}: STKDialogProps) {

    return (
        <ThemeProvider theme={theme}>
            <Dialog
                open={active}
                fullScreen={fullScreen}
                onClose={() => onClose()}
                aria-describedby="alert-dialog-slide-description"
            >
                <div className="p-4">
                    <div className="flex justify-end">
                        <button className="IconButton" aria-label="Close" onClick={() => onClose()}>
                            <Cross2Icon />
                        </button>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </Dialog>
        </ThemeProvider>
    );
}
