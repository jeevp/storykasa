import {TextField, ThemeProvider} from "@mui/material";
import {beige300} from "@/assets/colorPallet/colors";
import theme from "@/components/theme";

interface STKTextFieldProps {
    onChange: Function
    multiline?: boolean
    minRows?: number
    maxRows?: number
    fluid?: boolean
    placeholder?: string
    type?: string
    value?: string
}

function STKTextField({
    fluid = false,
    multiline = false,
    minRows = 5,
    maxRows = 10,
    value,
    placeholder,
    type,
    onChange = () => ({})
}: STKTextFieldProps) {
    return (
        <ThemeProvider theme={theme}>
            <TextField
            sx={{ width: fluid ? '100%' : '300px', backgroundColor: beige300 }}
            multiline={multiline}
            minRows={minRows}
            type={type}
            value={value}
            placeholder={placeholder}
            maxRows={maxRows}
            onChange={(e) => onChange(e.target.value)} />
        </ThemeProvider>
    )
}

export default STKTextField
