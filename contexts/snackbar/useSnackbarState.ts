import { useState } from 'react';

export default function useSnackbarState() {
    const [snackbarBus, setSnackbarBus] = useState<any>(null);

    return {
        snackbarBus,
        setSnackbarBus
    };
}
