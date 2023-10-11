import {LinearProgress, ThemeProvider} from "@mui/material";
import React from "react";
import theme from "@/components/theme";

interface STKLinearProgressProps {
    value: any
}
export default function STKLinearProgress(props: STKLinearProgressProps) {
    return (
        <ThemeProvider theme={theme}>
            <LinearProgress variant="determinate" color="primary" value={props.value} />
        </ThemeProvider>
    )
}
