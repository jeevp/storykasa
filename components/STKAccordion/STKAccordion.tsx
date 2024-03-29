import {Accordion, AccordionDetails, AccordionSummary, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./style.scss";

interface STKAccordionProps {
    title: string
    titlePrefix?: boolean
    titleSize?: string
    text?: string
    list?: Array<string>
    defaultExpanded?: boolean
    children?: any
    alignContentLeft?: boolean
    category?: string
    categoryColor?: string
}

export default function STKAccordion({
    title,
    titlePrefix,
    category,
    categoryColor,
    titleSize,
    text,
    list,
    defaultExpanded,
    children,
    alignContentLeft
}: STKAccordionProps) {
    return (
        <ThemeProvider theme={theme}>
            <Accordion
            classes={{ root: "stk-accordion" }}
            defaultExpanded={defaultExpanded}>
                <AccordionSummary classes={{ root: "stk-accordion--summary" }} expandIcon={<ExpandMoreIcon />}>
                    <div className="flex items-center">
                        {titlePrefix ? (
                            <label className="mr-6 font-semibold uppercase text-sm">
                                {titlePrefix}
                            </label>
                        ) : null}
                        <div className="overflow-hidden max-w-[180px] lg:max-w-full text-ellipsis">
                            <label className={`font-semibold text-base m-0 whitespace-nowrap ${titleSize ? titleSize : ''}`}>
                                {title}
                            </label>
                        </div>
                        {category ? (
                            <div className={`rounded-2xl flex justify-center items-center py-1 px-3 ${categoryColor} ml-4`}>
                                <label className="uppercase font-semibold text-[10px]">{category}</label>
                            </div>
                        ) : null}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {children ? (
                        <div className={titlePrefix && !alignContentLeft ? 'ml-[100px]' : ''}>
                            {children}
                        </div>
                    ) : (
                        <>
                            {list ? (
                                <ul className="m-0">
                                    {list.map((listItem: any, index: any) => (
                                        <li key={index} className="text-sm">{listItem}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="m-0 text-sm">{text}</p>
                            )}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    )
}
