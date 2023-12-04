import * as React from 'react';
import {Checkbox, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

interface STKCheckboxProps {
    checked?: boolean
    onChange?: (checked: boolean) => void
}

export default function STkCheckbox({ checked, onChange = () => ({}) }: STKCheckboxProps) {
    const handleOnChange = (e: any) => {
        onChange(e.target.checked)
    }

    return (
        <ThemeProvider theme={theme}>
            <Checkbox checked={checked} onChange={handleOnChange}/>
        </ThemeProvider>
    );
}
