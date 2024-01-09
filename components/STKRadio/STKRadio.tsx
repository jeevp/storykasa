import {ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import Radio from "@mui/material/Radio";

export default function STKRadio(props: any) {
    return (
        <ThemeProvider theme={theme}>
            <Radio {...props} />
        </ThemeProvider>
    )
}
