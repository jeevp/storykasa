import {createTheme, PaletteColor, PaletteColorOptions} from "@mui/material";
import {green300, green600, neutral300, neutral400, neutral800, red600, yellow600} from "@/assets/colorPallet/colors";

declare module '@mui/material/styles' {
    interface Palette {
        aiMode?: PaletteColor;
    }
    interface PaletteOptions {
        aiMode?: PaletteColorOptions;
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: green600,
            light: green300,
        },
        error: {
            main: red600,
            light: red600,
        },
        secondary: {
            main: yellow600,
            light: yellow600,
        },
        info: {
            main: neutral800,
            light: neutral300,
            dark: neutral400
        },
        aiMode: {
            main: "#8f65d9",
        },
    },
    typography: {
        // @ts-ignore
        fontFamily: [
            "DM Sans !important",
            "system-ui",
            "Avenir",
            "Helvetica",
            "Arial",
            "sans-serif"
        ]
    }
});


export default theme
