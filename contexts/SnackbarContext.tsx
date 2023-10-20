import { createContext } from "react";

interface SnackbarContextProps {
    snackbarBus: {
        active: false,
        message: "",
        type: ""
    },
    setSnackbarBus: ({ active, message, type }: { active: boolean, message: string, type: string }) => void
}

const SnackbarContext = createContext<SnackbarContextProps>({
    snackbarBus: {
        active: false,
        message: "",
        type: ""
    },
    setSnackbarBus: () => {},
});

export default SnackbarContext;
