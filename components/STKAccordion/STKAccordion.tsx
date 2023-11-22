import {Accordion, AccordionDetails, AccordionSummary, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./style.scss";

interface STKAccordionProps {
    title: string
    text?: string
    list?: Array<string>
}

export default function STKAccordion({ title, text, list }: STKAccordionProps) {
    return (
        <ThemeProvider theme={theme}>
            <Accordion classes={{ root: "stk-accordion" }}>
                <AccordionSummary classes={{ root: "stk-accordion--summary" }} expandIcon={<ExpandMoreIcon />}>
                    <h3 className="font-semibold text-base m-0">{title}</h3>
                </AccordionSummary>
                <AccordionDetails>
                    {list ? (
                        <ul>
                            {list.map((listItem: any, index: any) => (
                                <li key={index} className="text-sm">{listItem}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="m-0 text-sm">{text}</p>
                    )}
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    )
}
