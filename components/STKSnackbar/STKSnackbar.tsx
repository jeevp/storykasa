import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import React, { useContext } from "react";
import STKButton from "@/components/STKButton/STKButton";
import { X } from "@phosphor-icons/react";
import SnackbarContext from "@/contexts/SnackbarContext";
import {neutral800} from "@/assets/colorPallet/colors";

interface STKSnackbarProps {
    open: boolean;
    message: string;
    type?: "success" | "warning" | "error";
    onClose?: () => void;
}

export default function STKSnackbar({
                                        open,
                                        message,
                                        type,
                                        onClose = () => ({})
                                    }: STKSnackbarProps) {
    const { setSnackbarBus } = useContext(SnackbarContext);

    const handleOnClose = () => {
        setSnackbarBus({
            active: false,
            message: "",
            type: ""
        });

        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleOnClose}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
            <Alert
                onClose={handleOnClose}
                severity={type}
                sx={{
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px'
                }}
                action={
                    <STKButton
                        iconButton
                        onClick={handleOnClose}>
                        <X size={18} color={neutral800} />
                    </STKButton>
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
