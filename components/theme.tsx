import {createTheme} from "@mui/material";
import {green600, red600} from "@/assets/colorPallet/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: green600,
        },
        error: {
            main: red600
        }
    },
});


export default theme
