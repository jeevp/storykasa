import * as React from 'react';
import {Checkbox, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

interface STKCheckboxProps {
    checked: boolean
}

export default function STkCheckbox({ checked }: STKCheckboxProps) {
    return (
        <ThemeProvider theme={theme}>
            <Checkbox checked={checked} />
        </ThemeProvider>
    );
}
