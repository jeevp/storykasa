import {Button, createTheme, IconButton, styled, ThemeProvider} from "@mui/material";
import {green300, neutral800} from "@/assets/colorPallet/colors";
import useDevice from "@/customHooks/useDevice";
import {Microphone} from "@phosphor-icons/react";

const StyledButton = styled(Button)(({
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

const StyledIconButton = styled(IconButton)(({
    theme,
    rounded,
    alignStart,
    color
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
});

interface STKButtonTabsProps {
    onClick: () => void
}
export default function RecordButton({ onClick     = () => ({}) }: STKButtonTabsProps) {
    const { onMobile } = useDevice()

    return (
        <ThemeProvider theme={STKButtonTabsTheme}>
            {onMobile ? (
                <StyledIconButton
                    alignStart={true}
                    fullWidth
                    disableElevation
                    color="primary"
                    onClick={() => onClick()}
                    variant="contained">
                    <Microphone size={24} weight="duotone" color={neutral800} />
                </StyledIconButton>
            ) : (
                <StyledButton
                    alignStart={true}
                    fullWidth
                    disableElevation
                    color="primary"
                    onClick={() => onClick()}
                    variant="contained"
                    startIcon={<Microphone size={24} weight="duotone" />}>
                    Add a story
                </StyledButton>
            )}
        </ThemeProvider>
    )
}
