import * as React from 'react';
import {Checkbox, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

interface STKCheckboxProps {
    checked: boolean
    onChange?: () => void
}

export default function STkCheckbox({ checked, onChange = () => ({}) }: STKCheckboxProps) {
    return (
        <ThemeProvider theme={theme}>
            <Checkbox checked={checked} onChange={(e: Event) => onChange(e.target.checked)}/>
        </ThemeProvider>
    );
}
