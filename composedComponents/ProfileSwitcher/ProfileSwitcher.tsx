import { useContext, useEffect, useState } from 'react'
import { ProfileContext } from '@/composedComponents/ProfileProvider/ProfileProvider'
import { Profile } from '@/lib/database-helpers.types'
import ProfileEditor from '../ProfileEditor/ProfileEditor'
import { ArrowLeft, PencilSimple, Plus, Users } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import {Avatar} from "@mui/material";
import STKButton from "@/components/STKButton/STKButton";

export default function ProfileSwitcher({ profiles, managing }: { profiles: Profile[], managing: boolean }) {
    // Context
    const { setCurrentProfileID } = useContext(ProfileContext) as any

    // Hooks
    const router = useRouter()

    // State
    const [editing, setEditing] = useState(false)
    const [profileOptions, setProfileOptions] = useState<Profile[]>(profiles)
    const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

    // Watchers
    useEffect(() => {
        if (!managing) setEditing(false)
    }, [managing]);

    // Methods
    const editProfile = (id: string) => {
        const profile = profileOptions.find((p: Profile) => {
            return p.profile_id === id
        })
        if (profile) {
            setEditing(true)
            setProfileToEdit(profile)
        } else {
            setEditing(true)
            setProfileToEdit(null)
        }
    }


    const selectProfile = async (profile: Profile) => {
        const id = profile.profile_id
        localStorage.setItem('currentProfileID', id)
        setCurrentProfileID(id)
        await router.push('/library')
    }

    const addProfile = () => {
        setEditing(true)
    }

    console.log({ editing, managing })

    return (
        <div className="mt-5 flex-col">
            <div className="flex items-start">
                {profileOptions.map((profile: Profile) => (
                    <div className="flex flex-col items-center">
                        <div
                            className="flex flex-col items-center justify-center relative"
                            key={profile.profile_id}
                        >
                            <STKButton
                                iconButton
                                onClick={() => selectProfile(profile)}
                            >
                                <Avatar
                                    src={profile.avatar_url || ''}
                                    sx={{ width: 80, height: 80 }} />
                            </STKButton>

                            <div className="flex items-center mt-2">
                                <label className="font-bold">
                                    {profile.profile_name}
                                </label>
                            </div>
                        </div>
                        {managing && (
                            <div className="mt-4">
                                <STKButton
                                    onClick={() => editProfile(profile.profile_id)}
                                    variant="outlined"
                                    rounded
                                    slim
                                    startIcon={<PencilSimple size={16} weight="bold" />}
                                >
                                    Edit
                                </STKButton>
                            </div>
                        )}
                    </div>
                ))}

                {managing && !editing && (
                    <div className="flex justify-center items-center" style={{ height: "88px", width: "88px" }}>
                        <div className="ml-4">
                            <STKButton
                                iconButton
                                height="88px"
                                width="88px"
                                onClick={addProfile}
                            >
                                    <Plus size={24} weight="bold"></Plus>
                            </STKButton>
                        </div>
                    </div>
                )}
            </div>

            {managing && editing && !profileToEdit && !profiles.length && (
                <div className="flex flex-col">
                    <p className="font-bold">
                        To get started, set up your first profile.
                    </p>
                    <p>
                        Each member of your account can make a profile for creating and
                        listening to stories. All members share the same account login
                        information.
                    </p>
                </div>
            )}

            {managing && editing && (
                <div className="mt-6">
                    <ProfileEditor profileToEdit={profileToEdit}></ProfileEditor>
                </div>
            )}
        </div>
    )
}
