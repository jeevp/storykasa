import {Button, ButtonProps, IconButton, styled, ThemeProvider} from "@mui/material";
import STKLoading from "@/components/STKLoading/STKLoading";
import {green600, neutral800} from "@/assets/colorPallet/colors";
import theme from "@/components/theme";


interface StyledButtonProps extends ButtonProps {
    rounded?: boolean;
    alignStart?: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps>(({
    theme,
    rounded,
    alignStart,
}) => ({
    textTransform: 'none',
    borderRadius: rounded ? '20px' : '8px',
    justifyContent: alignStart ? 'flex-start' : '',
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
    alignStart?: boolean
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
    type = "button",
    iconButton,
    alignStart,
    onClick = () => ({})
}: STKButtonProps) {
    const isThemeColor = color.includes('.');

    const buttonSx = isThemeColor ? {
        backgroundColor: (theme: any) => theme.palette[color.split('.')[0]][color.split('.')[1]],
        '&:hover': {
            backgroundColor: (theme: any) => theme.palette[color.split('.')[0]].dark,
        },
        textTransform: "none",
        height: slim ? "30px" : height || "40px",
        width: fullWidth ? "100%" : width || "auto",
        color: neutral800
    } : {
        textTransform: "none",
        height: slim ? "30px" : height || "40px",
        width: fullWidth ? "100%" : width || "auto"
    };

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
                color={color as string | any}
                sx={{
                    width: width || "auto",
                    height: height || "auto"
                }}
                onClick={(e) => onClick(e)}>
                    {children}
                </IconButton>
            ) : (
                <StyledButton
                    startIcon={loading ? <></> : startIcon}
                    endIcon={loading ? <></> : endIcon}
                    fullWidth={fullWidth}
                    color={!isThemeColor ? color : undefined}
                    type={type as 'button' | 'submit' | 'reset'}
                    rounded={rounded}
                    alignStart={alignStart}
                    disableElevation
                    variant={variant as 'text' | 'outlined' | 'contained'}
                    sx={buttonSx}
                    onClick={(e) => onClick(e)}>
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
