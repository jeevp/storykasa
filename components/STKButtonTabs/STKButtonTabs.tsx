import {Button, createTheme, styled, ThemeProvider} from "@mui/material";
import {useState} from "react";
import {green300, green600, red600, yellow600} from "@/assets/colorPallet/colors";

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
    boxShadow: color === "primary" ? '0 0 0 2px #dcbe54' :  color === 'secondary' ? '0 0 0 2px #eee7ce' : '',
    "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: color === "primary" ? yellow600 :  color === 'secondary' ? '#faf5e3' : '',
        boxShadow: color === "primary" ? '0 0 0 2px #dcbe54' :  color === 'secondary' ? '0 0 0 2px #eee7ce' : ''
    }
}));

const STKButtonTabsTheme = createTheme({
    palette: {
        primary: {
            main: yellow600,
        },
        secondary: {
            main: "#faf5e3"
        }
    },
});

interface STKButtonTabsProps {
    tabs: Array<any>,
    onChange: () => void
}
export default function STKButtonTabs({
    tabs = [],
    onChange = () => ({})
}: STKButtonTabsProps) {
    // States
    const [activeIndex, setActiveIndex] = useState<number>()

    // Methods
    const handleOnClick = (index: number, tab: any) => {
        setActiveIndex(index)
        onChange(tab)
    }


    return (
        <div>
            {tabs.map((tab: any, index) => (
                <div className={`${index > 0 ? 'mt-4' : ''}`}>
                    <ThemeProvider theme={STKButtonTabsTheme}>
                        <StyledButton
                            alignStart={true}
                            fullWidth
                            disableElevation
                            color={activeIndex === index ? 'primary' : 'secondary'}
                            onClick={() => handleOnClick(index, tab)}
                            variant="contained"
                            startIcon={tab?.icon}>
                            {tab.text}
                        </StyledButton>
                    </ThemeProvider>
                </div>
            ))}
        </div>
    )
}
