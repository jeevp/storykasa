import {InputAdornment, TextField, ThemeProvider} from "@mui/material";
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
    startAdornment?: any
}

function STKTextField({
    fluid = false,
    multiline = false,
    minRows = 5,
    maxRows = 10,
    value,
    startAdornment,
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
            InputProps={startAdornment ? ({
                startAdornment: (
                    <InputAdornment position="start">
                        {startAdornment}
                    </InputAdornment>
                ),
            }) : <></>}
            onChange={(e) => onChange(e.target.value)} />
        </ThemeProvider>
    )
}

export default STKTextField