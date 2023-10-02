import {Button, IconButton, styled, ThemeProvider} from "@mui/material";
import STKLoading from "@/components/STKLoading/STKLoading";
import {green600} from "@/assets/colorPallet/colors";
import theme from "@/components/theme";


const StyledButton = styled(Button)(({ theme, color, forceColor }) => ({
    textTransform: 'none',
    height: '40px'
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
    type?: string
    onClick?: Function
    iconButton?: boolean
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
    type,
    iconButton,
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
            {iconButton ? (
                <IconButton>
                    {children}
                </IconButton>
            ) : (
                <StyledButton
                    startIcon={loading ? <></> : startIcon}
                    endIcon={loading ? <></> : endIcon}
                    fullWidth={fullWidth}
                    color={color}
                    type={type}
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
            )}
        </ThemeProvider>
    )
}
