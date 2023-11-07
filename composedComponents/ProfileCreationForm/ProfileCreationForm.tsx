import STKTextField from "@/components/STKTextField/STKTextField";
import STKButton from "@/components/STKButton/STKButton";
import {Avatar, Badge} from "@mui/material";
import Profile from "@/models/Profile"
import STKCard from "@/components/STKCard/STKCard";
import ImageUploading, {ImageListType} from "react-images-uploading";
import {green600, red600} from "@/assets/colorPallet/colors";
import {PencilSimple, UserPlus, X} from "@phosphor-icons/react";
import {useContext, useEffect, useState} from "react";
import useDevice from "@/customHooks/useDevice";
import {resizeImage} from "@/lib/utils";
import {AVATAR_BUCKET_NAME, AVATAR_FILE_EXTENSION} from "@/config";
import StorageHandler from "@/handlers/StorageHandler";
import ProfileHandler from "@/handlers/ProfileHandler";
import ProfileContext from "@/contexts/ProfileContext";

interface ProfileCreationFormProps {
    profile?: Profile | any,
    onSuccess?: () => void
}

export default function ProfileCreationForm({
    profile,
    onSuccess = () => ({})
}: ProfileCreationFormProps) {
    // States
    const [loading, setLoading] = useState(false)
    const [profileName, setProfileName] = useState<string>("")
    const [images, setImages] = useState<Array<any>>([])

    // Contexts
    const {
        setCurrentProfile,
        currentProfileId
    } = useContext(ProfileContext) as any

    // Hooks
    const { onMobile } = useDevice()

    // Watchers
    useEffect(() => {
        if (profile) {
            setProfileName(String(profile?.profileName))
            if (profile.avatarUrl) {
                setImages([{ dataURL: profile?.avatarUrl }])
            }
        }
    }, [profile]);

    // Methods
    const handleProfileNameOnChange = (name: string) => {
        setProfileName(name)
    }

    const handleProfileCreation = async () => {
        try {
            setLoading(true)
            const payload = {}
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

                // @ts-ignore
                payload.avatarUrl = await StorageHandler.uploadFile(avatarFormData)
            }

            if (profile?.profileId) {
                await ProfileHandler.updateProfile({ profileId: profile.profileId }, {
                    // @ts-ignore
                    name: payload.profileName,
                    // @ts-ignore
                    avatarUrl: payload.avatarUrl
                })
            } else {
                const createdProfile = await ProfileHandler.updateProfile({
                    profileId: currentProfileId
                }, {
                    // @ts-ignore
                    name: payload.profileName,
                    // @ts-ignore
                    avatarUrl: payload.avatarUrl
                })

                setCurrentProfile(createdProfile)
            }

            onSuccess()
        } finally {
            setLoading(false)
        }
    }

    const onChange = (imageList: ImageListType) => {
        setImages(imageList as never[])
    }


    return (
        <STKCard>
            <form onSubmit={handleProfileCreation} className="p-6">
                <div className="flex items-center flex-col lg:flex-row">
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
                    <div className="mr-0 lg:mr-4 mt-4 lg:mt-0 w-full lg:w-auto lg:ml-4">
                        <label className="font-semibold">
                            Profile name
                        </label>
                        <div className="mt-2">
                            <STKTextField
                                value={profileName}
                                fluid={onMobile}
                                onChange={handleProfileNameOnChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <STKButton
                        startIcon={<UserPlus size={20} weight="duotone" />}
                        loading={loading}
                        fullWidth={onMobile}
                        onClick={handleProfileCreation}>
                        Save profile
                    </STKButton>
                </div>
            </form>
        </STKCard>
    )
}
