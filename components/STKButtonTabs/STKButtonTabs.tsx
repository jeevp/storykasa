import {Button, createTheme, IconButton, styled, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {yellow600} from "@/assets/colorPallet/colors";
import useDevice from "@/customHooks/useDevice";

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

const StyledIconButton = styled(IconButton)(({
     theme,
     rounded,
     alignStart,
     color
}) => ({
    textTransform: 'none',
    borderRadius: "15px",
    height: "48px",
    width: "56px",
    justifyContent: "justify-center",
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
    useIconButtonOnMobile?: boolean
    initialValue?: object,
    onChange: () => void
}
export default function STKButtonTabs({
    tabs = [],
    useIconButtonOnMobile,
    initialValue,
    onChange = () => ({})
}: STKButtonTabsProps) {
    const { onMobile } = useDevice()
    // States
    const [activeIndex, setActiveIndex] = useState<number>()
    // Watchers
    useEffect(() => {
        if (initialValue) {
            const index = tabs.findIndex((tab) => tab.pathname === initialValue.pathname)
            setActiveIndex(index)
        }
    }, [initialValue]);
    // Methods
    const handleOnClick = (index: number, tab: any) => {
        setActiveIndex(index)
        onChange(tab)
    }

    const generateCSSClasses = (index: number): string => {
        const classesObject = {
            "mt-4": !onMobile && index > 0,
            "ml-4": useIconButtonOnMobile && onMobile && index > 0
        };

        return Object.keys(classesObject)
            .filter(key => classesObject[key])
            .join(' ');
    };

    return (
        <div className={`${onMobile && useIconButtonOnMobile ? 'flex' : 'lg:w-full w-auto'}`}>
            {tabs.map((tab: any, index) => (
                <div className={generateCSSClasses(index)}>
                    <ThemeProvider theme={STKButtonTabsTheme}>
                        {onMobile && useIconButtonOnMobile ? (
                            <StyledIconButton
                                alignStart={true}
                                fullWidth
                                disableElevation
                                color={activeIndex === index ? 'primary' : 'secondary'}
                                onClick={() => handleOnClick(index, tab)}
                                variant="contained">
                                {tab.icon}
                            </StyledIconButton>
                        ) : (
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
                        )}
                    </ThemeProvider>
                </div>
            ))}
        </div>
    )
}
