import {Tab, Tabs, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import {SyntheticEvent, useState, useEffect} from "react";

interface STKTabsProps {
    tabs: any[],
    value: number,
    onChange: (value: object) => ({})
}
export default function STKTabs({ tabs = [], value, onChange = () => ({}) }: STKTabsProps) {
    const [selectedTab, setSelectedTab] = useState<number | null>(null)

    useEffect(() => {
        if (value >= 0) {
            setSelectedTab(value)
        }
    }, [value])

    const handleChange = (e: SyntheticEvent, value: number) => {
        setSelectedTab(value)
        onChange(tabs[value])
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="border-b border-0 border-neutral-300 border-solid">
                <Tabs value={selectedTab} onChange={handleChange}>
                    {tabs.map((tab, index) => (
                        <Tab sx={{ textTransform: "none",fontSize: "16px" }} key={index} label={tab.label} />
                    ))}
                </Tabs>
            </div>
        </ThemeProvider>
    )
}
