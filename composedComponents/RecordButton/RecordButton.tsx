import {Button, ButtonProps, IconButtonProps, createTheme, IconButton, styled, ThemeProvider} from "@mui/material";
import {green300, neutral800} from "@/assets/colorPallet/colors";
import useDevice from "@/customHooks/useDevice";
import {Microphone} from "@phosphor-icons/react";

interface StyledButtonProps extends ButtonProps {
    rounded?: boolean;
    alignStart?: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps>(({
    theme,
    rounded,
    alignStart,
    color
}) => ({
    textTransform: 'none',
    borderRadius: rounded ? "20px" : "15px",
    height: "46px",
    justifyContent: alignStart ? "flex-start" : "",
    backgroundColor: green300,
    boxShadow: "0 5px 0 #6bc563",
    "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: green300,
        boxShadow: "0 5px 0 #6bc563"
    }
}));

interface StyledIconButtonProps extends IconButtonProps {
    rounded?: boolean;
    alignStart?: boolean;
}

const StyledIconButton = styled(IconButton)<StyledIconButtonProps>(({
    theme,
}) => ({
    textTransform: 'none',
    borderRadius: "15px",
    height: "48px",
    backgroundColor: green300,
    width: "56px",
    justifyContent: "justify-center",
    boxShadow: "0 5px 0 #6bc563",
    "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: green300,
        boxShadow: "0 5px 0 #6bc563"
    }
}));

const STKButtonTabsTheme = createTheme({
    palette: {
        primary: {
            main: green300,
        },
        secondary: {
            main: "#faf5e3"
        }
    },
    typography: {
        // @ts-ignore
        fontFamily: [
            "DM Sans !important",
            "sans-serif"
        ]
    }
});

interface STKButtonTabsProps {
    onClick: () => void
}
export default function RecordButton({ onClick     = () => ({}) }: STKButtonTabsProps) {

    return (
        <ThemeProvider theme={STKButtonTabsTheme}>
            <StyledButton
                alignStart={true}
                fullWidth
                disableElevation
                color="primary"
                onClick={() => onClick()}
                variant="contained"
                startIcon={<Microphone size={24} weight="duotone" />}>
                Create a story
            </StyledButton>
        </ThemeProvider>
    )
}
