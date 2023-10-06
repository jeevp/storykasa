import {Drawer} from "@mui/material";

interface STKDrawerProps {
    open: boolean
    children: any
    anchor: "right" | "bottom" | "top" | "left" | undefined
    onClose: () => void
}

export default function STKDrawer({ open, children, anchor, onClose = () => ({}) }: STKDrawerProps) {
    return (
        <Drawer open={open} onClose={() => onClose()} anchor={anchor}>
            <div>
                {children}
            </div>
        </Drawer>
    )
}
