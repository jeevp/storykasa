import { Autocomplete, TextField, ThemeProvider } from "@mui/material";
import theme from "@/components/theme";

interface STKAutocompleteProps {
  options: Array<Object>;
  optionLabel: string;
  optionValue?: string;
  disablePortal?: boolean;
  disabled?: boolean;
  fluid?: boolean;
  color?: string;
  groupByProp?: string;
  placeholder?: string;
  value?: any;
  onChange: Function;
}
function STKAutocomplete({
  options = [],
  optionLabel = "label",
  optionValue = "value",
  disablePortal = true,
  disabled = false,
  fluid = false,
  color,
  groupByProp = "category",
  placeholder,
  value,
  onChange = (value: Object) => ({}),
}: STKAutocompleteProps) {
  const handleOnChange = (e: Event, value: Object) => {
    onChange(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        disabled={disabled}
        disablePortal={disablePortal}
        id="combo-box-demo"
        options={options}
        color={color}
        value={value}
        sx={{ width: fluid ? "100%" : "300px", backgroundColor: "white" }}
        // @ts-ignore
        groupBy={(option) => option[groupByProp]}
        // @ts-ignore
        getOptionLabel={(option) => option[optionLabel]}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
        // @ts-ignore
        onChange={handleOnChange}
      />
    </ThemeProvider>
  );
}

export default STKAutocomplete;
