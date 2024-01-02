import {Chip, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

export default function STKChip(props: any) {
    return (
        <ThemeProvider theme={theme}>
            <Chip {...props} />
        </ThemeProvider>
    )
}
