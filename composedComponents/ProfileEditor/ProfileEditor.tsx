import {useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {ArrowCircleRight, PencilSimple, UserPlus, X,} from '@phosphor-icons/react'
import {Profile} from '@/lib/database-helpers.types'
import {resizeImage} from '@/lib/utils'
import STKCard from "@/components/STKCard/STKCard";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKButton from "@/components/STKButton/STKButton";
import {Avatar, Badge} from "@mui/material";
import ProfileHandler from "@/handlers/ProfileHandler";
import StorageHandler from "@/handlers/StorageHandler";
import FeedbackDialog from "@/composedComponents/FeedbackDialog/FeedbackDialog";
import {useRouter} from "next/navigation";
import theme from "@/components/theme";
import {green600, red600} from "@/assets/colorPallet/colors";
import {AVATAR_BUCKET_NAME, AVATAR_FILE_EXTENSION} from "@/config";

export default function ProfileEditor({
    profileToEdit,
}: {
    profileToEdit?: Profile | null
}) {
    // Hooks
    const router = useRouter()

    // States
    const [profileName, setProfileName] = useState('')
    const [loading, setLoading] = useState(false)
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
    const [processingRouteChange, setProcessingRouteChange] = useState(false)
    const [images, setImages] = useState(
        profileToEdit ? [{ dataURL: profileToEdit.avatar_url } as any] : []
    )


    // Watchers
    useEffect(() => {
        if (profileToEdit) setProfileName(profileToEdit.profile_name)
    }, [profileToEdit]);

    // Methods
    const onChange = (imageList: ImageListType) => {
        setImages(imageList as never[])
    }

    const upsertProfile = async () => {
        try {
            setLoading(true)
            const payload = {}
            let profileId = null
            if (profileToEdit) profileId = profileToEdit.profile_id

            if (profileName && profileName!.length > 0) {
                // @ts-ignore
                payload["profileName"] = profileName
            } else {
                alert('Profile name cannot be empty')
            }

            // if there is a new avatar file, we need to upload to the bucket
            if (images.length && images[0].file) {
                const avatarFormData = new FormData()
                const file: Blob = await resizeImage(images[0].file, 200)
                avatarFormData.set('file', file)

                // @ts-ignore
                avatarFormData.set('uploadDetails', JSON.stringify({
                    bucketName: AVATAR_BUCKET_NAME,
                    extension: AVATAR_FILE_EXTENSION
                }))

                payload.avatarUrl = await StorageHandler.uploadFile(avatarFormData)
            }


            if (profileId) {
                await ProfileHandler.updateProfile({ profileId }, {
                    name: payload.profileName,
                    avatarUrl: payload.avatarUrl
                })
            } else {
                await ProfileHandler.createProfile({
                    name: payload.profileName,
                    avatarUrl: payload.avatarUrl
                })
            }

            setShowFeedbackDialog(true)
        } finally {
            setLoading(false)
        }
    }

    const handleProfileNameOnChange = (name: string) => {
        setProfileName(name)
    }

    const goToDiscoveryPage = async () => {
        setProcessingRouteChange(true)
        await router.push("/library")
    }

    const feedbackDialogTitle = `${profileToEdit ? 'Update' : 'Create'} profile for ${profileName}`
    const feedbackDialogText = "Your profile is now up to date, and you are ready to use StoryKasa"

    return (
        <STKCard padding="10px">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="mr-4">
                        <label className="font-semibold">
                            Profile name
                        </label>
                        <div className="mt-2">
                            <STKTextField
                                value={profileName}
                                onChange={handleProfileNameOnChange}
                            />
                        </div>
                    </div>

                    <ImageUploading
                        multiple
                        value={images}
                        onChange={onChange}
                        maxNumber={1}
                        resolutionHeight={100}
                        resolutionWidth={100}
                    >
                        {({
                              imageList,
                              onImageUpload,
                              onImageRemoveAll,
                              dragProps,
                          }) => (
                            <div className="mt-4">
                                {imageList.length ? (
                                    <>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={(
                                                <div className="rounded-full flex justify-center" style={{
                                                    backgroundColor: red600,
                                                    width: "32px",
                                                    height: "32px",
                                                }}>
                                                    <STKButton
                                                        iconButton
                                                        variant="contained"
                                                        onClick={onImageRemoveAll}
                                                    >
                                                        <div>
                                                            <X size={16} weight="bold" color="white" />
                                                        </div>
                                                    </STKButton>
                                                </div>
                                            )}
                                        >
                                            <Avatar
                                                src={imageList[0].dataURL}
                                                sx={{ width: 80, height: 80 }}/>
                                        </Badge>
                                    </>
                                ) : (
                                    <>

                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent={(
                                                <div className="rounded-full flex justify-center" style={{
                                                    backgroundColor: green600,
                                                    width: "32px",
                                                    height: "32px",
                                                }}>
                                                    <STKButton
                                                        iconButton
                                                        onClick={onImageUpload}
                                                        {...dragProps}
                                                    >
                                                        <PencilSimple size={16} weight="bold" color="white" />
                                                    </STKButton>
                                                </div>
                                            )}
                                        >
                                            <Avatar
                                                sx={{ width: 80, height: 80 }} />
                                        </Badge>

                                    </>
                                )}
                            </div>
                        )}
                    </ImageUploading>
                </div>

                <div className="mt-4">
                    <STKButton
                        startIcon={<UserPlus size={20} weight="duotone" />}
                        loading={loading}
                        onClick={upsertProfile}>
                        Save profile
                    </STKButton>
                </div>
            </div>
            <FeedbackDialog
            open={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
            title={feedbackDialogTitle}
            text={feedbackDialogText}
            loading={processingRouteChange}
            actionButtonStartIcon={() => <ArrowCircleRight size="20" />}
            actionButtonText="Enter StoryKasa"
            onAction={goToDiscoveryPage}/>
        </STKCard>
    )
}
