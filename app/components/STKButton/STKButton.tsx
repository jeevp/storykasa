import {Button} from "@mui/material";
import STKLoading from "@/app/components/STKLoading/STKLoading";
import {green600} from "@/app/assets/colorPallet/colors";

interface STKButtonProps {
    children: any
    startIcon?: any
    endIcon?: any
    variant?: string
    color?: string
    loading?: boolean
    fullWidth?: boolean
    onClick: Function
}

export default function STKButton({
    children,
    startIcon,
    endIcon,
    variant = "contained",
    color = "primary",
    fullWidth,
    loading,
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
        <Button
        startIcon={loading ? <></> : startIcon}
        endIcon={loading ? <></> : endIcon}
        fullWidth={fullWidth}
        color={color}
        variant={variant}
        sx={{ textTransform: "none", height: "40px" }}
        onClick={() => onClick()}>
            {loading ? (
                // @ts-ignore
                <STKLoading color={getLoadingColor()} />
            ) : (
                children
            )}
        </Button>
    )
}
