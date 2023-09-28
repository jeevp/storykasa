import {TextField, ThemeProvider} from "@mui/material";
import {beige300} from "@/app/assets/colorPallet/colors";
import theme from "@/app/components/theme";

interface STKTextFieldProps {
    onChange: Function
    multiline?: boolean
    minRows?: number
    maxRows?: number
    fluid?: boolean
}

function STKTextField({
    fluid = false,
    multiline = false,
    minRows = 5,
    maxRows = 10,
    onChange = () => ({})
}: STKTextFieldProps) {
    return (
        <ThemeProvider theme={theme}>
            <TextField
            sx={{ width: fluid ? '100%' : '300px', backgroundColor: beige300 }}
            multiline={multiline}
            minRows={minRows}
            maxRows={maxRows}
            onChange={(e) => onChange(e.target.value)} />
        </ThemeProvider>
    )
}

export default STKTextField
