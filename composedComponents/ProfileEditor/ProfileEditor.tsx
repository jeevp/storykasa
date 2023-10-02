import {useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {ArrowCircleRight, PencilSimple, UserPlus, X,} from '@phosphor-icons/react'
import {Profile} from '@/lib/database-helpers.types'
import {resizeImage} from '@/lib/utils'
import STKCard from "@/components/STKCard/STKCard";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKButton from "@/components/STKButton/STKButton";
import {Avatar} from "@mui/material";
import ProfileHandler from "@/handlers/ProfileHandler";
import StorageHandler from "@/handlers/StorageHandler";
import FeedbackDialog from "@/composedComponents/FeedbackDialog/FeedbackDialog";
import {useRouter} from "next/navigation";

export default function ProfileEditor({
    profileToEdit,
}: {
    profileToEdit?: Profile
}) {
    const router = useRouter()

    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
    const [images, setImages] = useState(
        profileToEdit ? [{ dataURL: profileToEdit.avatar_url } as any] : []
    )

    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        setImages(imageList as never[])
    }


    const [profileName, setProfileName] = useState('')

    const upsertProfile = async (profileFormData: FormData) => {
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
    }

    const handleProfileNameOnChange = (name: string) => {
        setProfileName(name)
    }

    const goToDiscoveryPage = async () => {
        await router.push("/library")
    }

    const feedbackDialogTitle = `${profileToEdit ? 'Update' : 'Create'} profile for ${profileName}`
    const feedbackDialogText = "Your profile is now up to date, and you are ready to use StoryKasa"

    return (
        <STKCard>
            <div className="flex items-start justify-between">
                <div>
                    <label>
                        Profile name
                    </label>

                        <div>
                            <STKTextField
                                value={profileName}
                                onChange={handleProfileNameOnChange}
                            />
                            <div>
                                <STKButton
                                startIcon={<UserPlus size={20} weight="duotone" />}
                                onClick={() => setShowFeedbackDialog(true)}>
                                    Save profile
                                </STKButton>
                            </div>
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
                        <div
                            style={{
                                position: 'relative',
                                margin: '0 10px',
                            }}
                        >
                            {imageList.length ? (
                                <>
                                    <STKButton
                                        color="tomato"
                                        iconButton
                                        onClick={onImageRemoveAll}
                                    >
                                        <X size={16} weight="bold" />
                                    </STKButton>
                                    <Avatar src={imageList[0].dataURL} />
                                </>
                            ) : (
                                <>
                                    <STKButton
                                        iconButton
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        <PencilSimple size={16} weight="bold" />
                                    </STKButton>
                                    <Avatar />
                                </>
                            )}
                        </div>
                    )}
                </ImageUploading>
            </div>
            <FeedbackDialog
            open={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
            title={feedbackDialogTitle}
            text={feedbackDialogText}
            actionButtonStartIcon={() => <ArrowCircleRight size="20" />}
            actionButtonText="Enter StoryKasa"
            onAction={goToDiscoveryPage}/>
        </STKCard>
    )
}
