import {createContextProvider} from "@/contexts/createContextProvider";
import useSnackbarState from "@/contexts/snackbar/useSnackbarState";

export const [SnackbarProvider, useSnackbar] = createContextProvider(useSnackbarState)
