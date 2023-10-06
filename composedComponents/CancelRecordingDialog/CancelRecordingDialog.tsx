import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import {Trash} from "@phosphor-icons/react";
import useDevice from "@/customHooks/useDevice";


interface CancelRecordingDialogProps {
    open: boolean;
    onClose?: () => void;
    onDeleteRecording?: () => void;
}

export default function CancelRecordingDialog({
    open,
    onClose = () => ({}),
    onDeleteRecording = () => ({})
}: CancelRecordingDialogProps) {
    const { onMobile } = useDevice()

    const handleDeleteRecording = () => {
        onDeleteRecording()
        onClose()
    }

    return (
        <STKDialog active={open} onClose={() => onClose()}>
            <div>
                <h2 className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap" style={{ maxWidth: "87%" }}>
                    Delete recording
                </h2>
                <p className="mt-4">
                    Are you sure you want to delete this recording and start over?
                </p>
                <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                    <div className="w-full lg:w-auto">
                        <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                            Cancel
                        </STKButton>
                    </div>
                    <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                            fullWidth={onMobile}
                            color="primary"
                            startIcon={<Trash size={20} />}
                            onClick={handleDeleteRecording}>
                            Yes, delete recording
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
