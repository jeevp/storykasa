import {Drawer} from "@mui/material";

export default function STKDrawer({ open, children, anchor, onClose = () => ({}) }) {
    return (
        <Drawer open={open} onClose={() => onClose()} anchor={anchor}>
            <div>
                {children}
            </div>
        </Drawer>
    )
}
