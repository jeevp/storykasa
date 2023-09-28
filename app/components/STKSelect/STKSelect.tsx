import {MenuItem, Select, ThemeProvider} from "@mui/material";
import theme from "@/app/components/theme";

interface STKSelectProps {
    options: Array<Object>,
    optionValue: string,
    optionLabel: string,
    value?: object,
    id?: string,
    fluid?: boolean,
    onChange: Function
}

function STKSelect({
    options = [],
    fluid,
    value,
    optionValue = "value",
    optionLabel = "label",
    id,
    onChange = (selectedOption: any) => ({})
}: STKSelectProps) {

    const handleChange = (e: Event) => {
        // @ts-ignore
        const selectedOption = options.find((option) => option[optionValue] === e?.target?.value)
        onChange(selectedOption)
    }

    return (
        <ThemeProvider theme={theme}>
            <Select
                id={id}
                value={value}
                sx={{ width: fluid ? '100%' : '300px', backgroundColor: "white" }}
                // @ts-ignore
                onChange={handleChange}
            >
                {options.map((option, index) => (
                    // @ts-ignore
                    <MenuItem key={index} value={option[optionValue]}>{option[optionLabel]}</MenuItem>
                ))}
            </Select>
        </ThemeProvider>
    )
}


export default STKSelect
