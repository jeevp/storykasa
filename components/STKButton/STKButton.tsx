import {Button, IconButton, styled, ThemeProvider} from "@mui/material";
import STKLoading from "@/components/STKLoading/STKLoading";
import {green600} from "@/assets/colorPallet/colors";
import theme from "@/components/theme";


const StyledButton = styled(Button)(({ theme, color, rounded }) => ({
    textTransform: 'none',
    borderRadius: rounded ? "20px" : "",
}));

interface STKButtonProps {
    children: any
    startIcon?: any
    endIcon?: any
    variant?: string
    color?: string
    loading?: boolean
    fullWidth?: boolean
    rounded?: boolean
    forceColor?: boolean
    type?: string
    onClick?: Function
    iconButton?: boolean
    slim?: boolean
    height?: string
    width?: string
}

export default function STKButton({
    children,
    startIcon,
    endIcon,
    variant = "contained",
    color = "primary",
    fullWidth,
    slim,
    loading,
    rounded,
    height,
    width,
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
                <IconButton
                color={color}
                sx={{
                    width: width || "auto",
                    height: height || "auto"
                }}
                onClick={() => onClick()}>
                    {children}
                </IconButton>
            ) : (
                <StyledButton
                    startIcon={loading ? <></> : startIcon}
                    endIcon={loading ? <></> : endIcon}
                    fullWidth={fullWidth}
                    color={color}
                    type={type}
                    rounded={rounded}
                    disableElevation
                    variant={variant}
                    sx={{ textTransform: "none", height: slim ? "30px" : height || "40px", width: width || "auto" }}
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
