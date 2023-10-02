import {Tooltip} from "@mui/material";

interface STKTooltipProps {
    children: any
    title: string
}

export default function STKTooltip({ children, title }: STKTooltipProps) {
    return (
        <Tooltip title={title}>
            {children}
        </Tooltip>
    )
}
