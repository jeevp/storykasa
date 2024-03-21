import {Accordion, AccordionDetails, AccordionSummary, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./style.scss";

interface STKAccordionProps {
    title: string
    titleSize?: string
    text?: string
    list?: Array<string>
    defaultExpanded?: boolean
    children?: any
}

export default function STKAccordion({
    title,
    titlePrefix,
    titleSize,
    text,
    list,
    defaultExpanded,
    children
}: STKAccordionProps) {
    return (
        <ThemeProvider theme={theme}>
            <Accordion
            classes={{ root: "stk-accordion" }}
            defaultExpanded={defaultExpanded}>
                <AccordionSummary classes={{ root: "stk-accordion--summary" }} expandIcon={<ExpandMoreIcon />}>
                    <h3 className={`font-semibold text-base m-0 flex items-center ${titleSize ? titleSize : ''}`}>
                        {titlePrefix ? <span className="mr-6 font-semibold uppercase text-sm">{titlePrefix}</span> : null}
                        {title}
                    </h3>
                </AccordionSummary>
                <AccordionDetails>
                    {children ? (
                        <div className={titlePrefix ? 'ml-[78px]' : ''}>
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
