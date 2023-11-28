import STKDialog from "@/components/STKDialog/STKDialog"
import STKButton from "@/components/STKButton/STKButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {beige400} from "@/assets/colorPallet/colors";
import STKLoading from "@/components/STKLoading/STKLoading";
import STKTextField from "@/components/STKTextField/STKTextField";
import {useState} from "react";


interface InfoDialogProps {
    active: boolean
    icon?: any
    text: string
    loadingBeforeContent?: boolean
    confirmationButtonText?: string
    title: string
    loading?: boolean
    enableComment?: boolean
    onClose?: () => void
    onAction?: (comment: string) => void
}

export default function InfoDialog({
    active,
    icon,
    loadingBeforeContent,
    title,
    text,
    loading,
    enableComment,
    confirmationButtonText,
    onClose = () => ({}),
    onAction = () => ({})
}: InfoDialogProps) {
    // States
    const [comment, setComment] = useState("")

    // Methods
    const handleClose = (e: MouseEvent) => {
        e.stopPropagation()
        onClose()
    }

    const handleAction = (e: MouseEvent) => {
        e.stopPropagation()
        onAction(comment)
    }

    const handleCommentOnChange = (value: string) => {
        setComment(value)
    }

    return (
        <STKDialog title={title} maxWidth="xs" active={active} onClose={handleClose}>
            <div>

                {loadingBeforeContent ? (
                    <div className="flex flex-col items-center mt-14">
                        <p>Submitting request to make story public</p>
                        <div className="mt-4">
                            <STKLoading />
                        </div>
                    </div>
                ) : (
                  <div className="mt-6">
                      <p className="text-neutral-800">{text}</p>
                      {enableComment && (
                          <div className="mt-6">
                              <label className="font-semibold text-md">Write a comment to the user</label>
                              <div className="mt-4">
                                  <STKTextField
                                      multiline
                                      fluid
                                      value={comment}
                                      onChange={handleCommentOnChange} />
                              </div>
                          </div>
                      )}
                  </div>
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
