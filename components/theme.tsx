import {createTheme} from "@mui/material";
import {green300, green600, neutral800, red600, yellow600} from "@/assets/colorPallet/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: green600,
            light: green300
        },
        error: {
            main: red600
        },
        secondary: {
            main: yellow600
        },
        info: {
            main: neutral800
        }
    },
});


export default theme
