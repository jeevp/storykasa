import { format } from 'timeago.js'
import { Baby, GlobeSimple, Timer } from '@phosphor-icons/react'
import STKCard from "@/components/STKCard/STKCard";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import {useState} from "react";
import {green600} from "@/assets/colorPallet/colors";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import StoryHandler from "@/handlers/StoryHandler";
import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog";
import PublicIcon from '@mui/icons-material/Public';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
// @ts-ignore
import PublicStoryRequest from "@/models/PublicStoryRequest";
import STKButton from "@/components/STKButton/STKButton";
import {useAdmin} from "@/contexts/admin/useAdmin";


const APPROVE_ACTION_TYPE = "APPROVE_ACTION_TYPE"
const REFUSE_ACTION_TYPE = "REFUSED_ACTION_TYPE"


export default function PublicStoryRequestCard({ publicStoryRequest }: {
    publicStoryRequest: PublicStoryRequest
    selected: boolean
}) {
    // States
    const [loadingAction, setLoadingAction] = useState(false)
    const [actionType, setActionType] = useState<undefined | string>(undefined)
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const [dialogContent, setDialogContent] = useState({
        title: "Thank you for sharing your story!",
        text: `We will review it and get back to you within 24 hours. Please note that 
        only a small number of user submitted stories are included in the public library`,
        confirmationButtonText: ""
    })

    // Contexts
    const { publicStoryRequests, setPublicStoryRequests } = useAdmin()
    const { setSnackbarBus } = useSnackbar()

    // Methods
    const handleApprove = () => {
        setActionType(APPROVE_ACTION_TYPE)
        setShowConfirmationDialog(true)
        setDialogContent({
            title: "Approve Story",
            text: "By approving this request, the story will become immediately available on the public library to all users.",
            confirmationButtonText: "Approve story"
        })
    }


    const handleRefuse = () => {
        setActionType(REFUSE_ACTION_TYPE)
        setShowConfirmationDialog(true)
        setDialogContent({
            title: "Refuse Story",
            text: "By refusing this request, the story will not become available on the public library.",
            confirmationButtonText: "Refuse story"
        })
    }

    const handleAction = async () => {
        try {
            setLoadingAction(true)
            const approved = Boolean(actionType === APPROVE_ACTION_TYPE)
            await StoryHandler.updatePublicStoryRequest({
                publicStoryRequestId: publicStoryRequest.id
            }, {
                approved
            })
            setLoadingAction(false)
            setShowConfirmationDialog(false)

            // @ts-ignore
            const _publicStoryRequests = publicStoryRequests?.filter((_publicStoryRequest: any) => {
                return _publicStoryRequest.id !== publicStoryRequest.id
            })

            setPublicStoryRequests(_publicStoryRequests)
            setSnackbarBus({
                active: true,
                message: approved ? 'Public story request approved with success.' : 'Public story request refused with success.',
                type: "success"
            });
        } catch (error) {
            setSnackbarBus({
                active: true,
                message: "Ops! Something went wrong.",
                type: "error"
            });
        }
    }


    return (
        <STKCard>
            <div className="p-4">
                <div className="flex">
                    <div className="flex justify-items-start">
                        <STKAvatar src={publicStoryRequest?.profile?.avatarUrl!} name={publicStoryRequest?.profile?.profileName} />
                    </div>
                    <div className="w-full cursor-pointer ml-4">
                        <div className="flex items-center justify-between w-full">
                            {publicStoryRequest?.profile?.profileName && (
                                <label>
                                    {publicStoryRequest?.profile?.profileName}
                                </label>
                            )}

                            <label className="text-xs">{format(publicStoryRequest?.createdAt)}</label>
                        </div>

                        <label className="font-semibold text-lg">
                            {publicStoryRequest?.story?.title}
                        </label>
                        {publicStoryRequest?.story?.publicStoryRequestApproved && (
                            <div className="flex items-center mt-2 bg-green-50 p-2 w-28 justify-center rounded-2xl">
                                <PublicIcon sx={{ fill: green600, width: "14px", height: "14px" }} />
                                <label className="ml-2 text-sm">Public story</label>
                            </div>
                        )}

                        {publicStoryRequest?.story?.publicStoryRequestProcessing && (
                            <div className="flex items-center mt-2 bg-orange-50 p-2 w-36 justify-center rounded-2xl">
                                <PendingOutlinedIcon sx={{ width: "14px", height: "14px" }} />
                                <label className="ml-2 text-sm">Pending approval</label>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center flex-wrap opacity-60 pr-14">
                        {publicStoryRequest?.story?.duration && (
                            <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                <Timer size={14} weight="bold" />
                                <label className="ml-1">
                                    {Math.ceil(publicStoryRequest?.story?.duration / 60)} min
                                </label>
                            </div>
                        )}
                        {publicStoryRequest?.story?.ageGroups && (
                            <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                <Baby size={14} weight="bold" />
                                <label className="ml-1">
                                    {publicStoryRequest?.story?.ageGroupsShortLabel}
                                </label>
                            </div>
                        )}
                        {publicStoryRequest?.story?.language && (
                            <div className="flex items-center">
                                <GlobeSimple size={14} weight="bold" />
                                <label className="ml-1">
                                    {publicStoryRequest?.story?.language}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <p>{publicStoryRequest?.story.description}</p>
                </div>

                <div className="mt-4">
                    <STKAudioPlayer outlined src={publicStoryRequest?.story.recordingUrl} />
                </div>
                <div className="flex items-center justify-end mt-8">
                    <div>
                        <STKButton variant="contained" onClick={handleApprove}>Approve</STKButton>
                    </div>
                    <div className="ml-2">
                        <STKButton variant="outlined" onClick={handleRefuse}>Refuse</STKButton>
                    </div>
                </div>
            </div>
            <InfoDialog
            active={showConfirmationDialog}
            title={dialogContent.title}
            text={dialogContent.text}
            loading={loadingAction}
            confirmationButtonText={dialogContent.confirmationButtonText}
            onAction={handleAction}
            onClose={() => setShowConfirmationDialog(false)} />
        </STKCard>
    )
}
