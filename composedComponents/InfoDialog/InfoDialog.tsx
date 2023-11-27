import STKDialog from "@/components/STKDialog/STKDialog"
import STKButton from "@/components/STKButton/STKButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {beige400, green600, neutral600, neutral800} from "@/assets/colorPallet/colors";
import {orange} from "@mui/material/colors";
import STKLoading from "@/components/STKLoading/STKLoading";
interface InfoDialogProps {
    active: boolean
    icon?: any
    text: string
    loadingBeforeContent?: boolean
    confirmationButtonText?: string
    title: string
    loading?: boolean
    onClose?: () => void
    onAction?: () => void
}

export default function InfoDialog({
    active,
    icon,
    loadingBeforeContent,
    title,
    text,
    loading,
    confirmationButtonText,
    onClose = () => ({}),
    onAction = () => ({})
}: InfoDialogProps) {
    // Methods
    const handleClose = (e: MouseEvent) => {
        e.stopPropagation()
        onClose()
    }

    const handleAction = (e: MouseEvent) => {
        e.stopPropagation()
        onAction()
    }

    return (
        <STKDialog maxWidth="xs" active={active} onClose={handleClose}>
            <div>

                {loadingBeforeContent ? (
                    <div className="flex flex-col items-center mt-14">
                        <p>Submitting request to make story public</p>
                        <div className="mt-4">
                            <STKLoading />
                        </div>
                    </div>
                ) : (
                  <>
                      <div className="flex justify-center">
                          {icon || <InfoOutlinedIcon sx={{ width: "40px", height: "40px", fill: beige400 }} /> }
                      </div>
                      <h3 className="text-center text-neutral-800">{title}</h3>
                      <p className="text-center px-10 text-neutral-800">{text}</p>
                  </>
                )}
                <div className="mt-10 flex justify-end items-center">
                    {confirmationButtonText ? (
                        <>
                            <div>
                                <STKButton variant="contained" loading={loading} onClick={handleAction}>{confirmationButtonText}</STKButton>
                            </div>
                            <div className="ml-2">
                                <STKButton variant="outlined" onClick={handleClose}>Cancel</STKButton>
                            </div>
                        </>
                    ) : (
                        <div>
                            <STKButton onClick={handleClose}>Close</STKButton>
                        </div>
                    )}
                </div>
            </div>
        </STKDialog>
    )
}
