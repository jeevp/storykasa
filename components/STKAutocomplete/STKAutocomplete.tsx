import {Autocomplete, TextField, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

interface STKAutocompleteProps {
    options: Array<Object>
    optionLabel: string
    fluid?: boolean
    groupByProp?: string
    onChange: Function
}
function STKAutocomplete({
    options = [],
    optionLabel = "label",
    fluid = false,
    groupByProp = "category",
    onChange = (value: Object) => ({})
}: STKAutocompleteProps) {

    const handleOnChange = (e: Event, value: Object) => {
        onChange(value)
    }

    return (
        <ThemeProvider theme={theme}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                sx={{ width: fluid ? '100%' : '300px', backgroundColor: "white" }}
                // @ts-ignore
                groupBy={(option) => option[groupByProp]}
                // @ts-ignore
                getOptionLabel={(option) => option[optionLabel]}
                renderInput={(params) => <TextField {...params}  />}
                // @ts-ignore
                onChange={handleOnChange}
            />
        </ThemeProvider>
    )
}


export default STKAutocomplete
