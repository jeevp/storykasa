import STKDialog from "@/components/STKDialog/STKDialog"
import STKButton from "@/components/STKButton/STKButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {beige400, green600, neutral600, neutral800} from "@/assets/colorPallet/colors";
import {orange} from "@mui/material/colors";
interface InfoDialogProps {
    active: boolean
    icon?: any
    text: string
    title: string
    onClose?: () => void
}

export default function InfoDialog({
    active,
    icon,
    title,
    text,
    onClose = () => ({})
}: InfoDialogProps) {
    // Methods
    const handleClose = (e: MouseEvent) => {
        e.stopPropagation()
        onClose()
    }

    return (
        <STKDialog maxWidth="xs" active={active} onClose={handleClose}>
            <div>
                <div className="flex justify-center">
                    {icon || <InfoOutlinedIcon sx={{ width: "40px", height: "40px", fill: beige400 }} /> }
                </div>
                <h3 className="text-center text-neutral-800">{title}</h3>
                <p className="text-center px-10 text-neutral-800">{text}</p>
                <div className="mt-10 flex justify-end">
                    <STKButton onClick={handleClose}>Close</STKButton>
                </div>
            </div>
        </STKDialog>
    )
}
