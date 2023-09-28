'use client'

import {Button, styled} from "@mui/material";
import STKLoading from "@/app/components/STKLoading/STKLoading";
import {green600} from "@/app/assets/colorPallet/colors";
import theme from "@/app/components/theme";
import {ThemeProvider} from "@mui/material";


const StyledButton = styled(Button)(({ theme, color, forceColor }) => ({
    textTransform: 'none',
    height: '40px',
    backgroundColor: color === 'primary' ? `${theme.palette.primary.main}${forceColor ? '!important' : ''}` : color === 'secondary' ? `${theme.palette.secondary.main}!` : undefined,
}));

interface STKButtonProps {
    children: any
    startIcon?: any
    endIcon?: any
    variant?: string
    color?: string
    loading?: boolean
    fullWidth?: boolean
    forceColor?: boolean
    onClick?: Function
}

export default function STKButton({
    children,
    startIcon,
    endIcon,
    variant = "contained",
    color = "primary",
    fullWidth,
    loading,
    forceColor,
    onClick = () => ({})
}: STKButtonProps) {
    const getLoadingColor = () => {
        if (color === "primary") {
            return "white"
        }

        return green600
    }


    return (
        // @ts-ignore
        <ThemeProvider theme={theme}>
            <StyledButton
            startIcon={loading ? <></> : startIcon}
            endIcon={loading ? <></> : endIcon}
            fullWidth={fullWidth}
            color={color}
            forceColor={forceColor}
            disableElevation
            variant={variant}
            sx={{ textTransform: "none", height: "40px"}}
            onClick={() => onClick()}>
                {loading ? (
                    // @ts-ignore
                    <STKLoading color={getLoadingColor()} />
                ) : (
                    children
                )}
            </StyledButton>
        </ThemeProvider>
    )
}
