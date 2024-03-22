import {Button, createTheme, styled, ThemeProvider} from "@mui/material";
import {useEffect, useState} from "react";
import {yellow600} from "@/assets/colorPallet/colors";
import {useRouter} from "next/router";

const StyledButton = styled(Button)(({
    rounded,
    alignStart,
    color
}: {
    rounded?: boolean
    alignStart?: boolean
    color?: string
}) => ({
    textTransform: 'none',
    borderRadius: rounded ? "20px" : "15px",
    height: "46px",
    fontFamily: 'DM Sans',
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
    typography: {
        // @ts-ignore
        fontFamily: [
            "DM Sans !important",
            "sans-serif"
        ]
    }
});

interface STKButtonTabsProps {
    tabs: Array<any>,
    initialValue?: object,
    onChange: (tab: any) => void
}
export default function STKButtonTabs({
    tabs = [],
    initialValue,
    onChange = () => ({})
}: STKButtonTabsProps) {
    const router = useRouter()
    // States
    const [activeIndex, setActiveIndex] = useState<number>()
    // Watchers
    useEffect(() => {
        if (initialValue) {
            // @ts-ignore
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
            "mt-4": index > 0,
        };

        // @ts-ignore
        return Object.keys(classesObject).filter(key => classesObject[key]).join(' ');
    };

    return (
        <div className={'lg:w-full w-auto'}>
            {tabs.map((tab: any, index) => (
                <div className={generateCSSClasses(index)} key={index}>
                    <ThemeProvider theme={STKButtonTabsTheme}>
                        <StyledButton
                            // @ts-ignore
                            alignStart
                            fullWidth
                            disableElevation
                            color={activeIndex === index || router.pathname.includes(tab.pathname) ? 'primary' : 'secondary'}
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
