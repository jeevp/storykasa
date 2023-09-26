import {Autocomplete, TextField} from "@mui/material";

interface STKAutocompleteProps {
    options: Array<Object>
    optionLabel: string,
    fluid?: boolean,
    onChange: Function
}
function STKAutocomplete({
    options = [],
    optionLabel = "label",
    fluid = false,
    onChange = (value: Object) => ({})
}: STKAutocompleteProps) {

    const handleOnChange = (e: Event, value: Object) => {
        onChange(value)
    }

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: fluid ? '100%' : '300px', backgroundColor: "white" }}
            // @ts-ignore
            getOptionLabel={(option) => option[optionLabel]}
            renderInput={(params) => <TextField {...params}  />}
            // @ts-ignore
            onChange={handleOnChange}
        />
    )
}


export default STKAutocomplete
