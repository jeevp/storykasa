import { useContext, useEffect, useState } from 'react'
import { ProfileContext } from '@/composedComponents/ProfileProvider/ProfileProvider'
import { Profile } from '@/lib/database-helpers.types'
import ProfileEditor from '../ProfileEditor/ProfileEditor'
import { ArrowLeft, PencilSimple, Plus, Users } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import {Avatar} from "@mui/material";
import STKButton from "@/components/STKButton/STKButton";

export default function ProfileSwitcher({ profiles }: { profiles: Profile[] }) {
    const { setCurrentProfileID } = useContext(ProfileContext) as any

    const [managing, setManaging] = useState(false)
    const [editing, setEditing] = useState(false)
    const [profileOptions, setProfileOptions] = useState<Profile[]>(profiles)
    const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

    const router = useRouter()

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

    useEffect(() => {
        if (!profiles.length) {
            setManaging(true)
            setEditing(true)
        }
    }, [])

    const selectProfile = async (profile: Profile) => {
        const id = profile.profile_id
        localStorage.setItem('currentProfileID', id)
        setCurrentProfileID(id)
        await router.push('/library')
    }

    console.log({ profileOptions })
    return (
        <div className="mt-5">
            <div className="flex">
                {profileOptions.map((profile: Profile) => (
                    <div
                        className="flex flex-col items-center justify-center relative"
                        key={profile.profile_id}
                    >
                        <STKButton
                            iconButton
                            onClick={() => selectProfile(profile)}
                        >
                            <Avatar src={profile.avatar_url || ''} />
                        </STKButton>

                        <div className="flex items-center mt-2">
                            <label className="font-bold">
                                {profile.profile_name}
                            </label>
                        </div>
                        {managing && (
                            <STKButton
                                onClick={() => editProfile(profile.profile_id)}
                                startIcon={<PencilSimple size={16} weight="bold" />}
                            >
                                Edit
                            </STKButton>
                        )}
                    </div>
                ))}

                {managing && !editing && (
                    <STKButton
                        onClick={() => editProfile('')}
                    >
                        <Plus size={24} weight="bold"></Plus>
                    </STKButton>
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

            {managing && editing && profileToEdit && (
                <ProfileEditor profileToEdit={profileToEdit}></ProfileEditor>
            )}
            {managing && editing && !profileToEdit && <ProfileEditor></ProfileEditor>}

            <div className="mt-6">
                <STKButton onClick={() => setManaging(!managing)}>
                    {managing ? (
                        <>
                            <ArrowLeft size={20} /> Back
                        </>
                    ) : (
                        <>
                            <Users size={20} /> Manage profiles
                        </>
                    )}
                </STKButton>
            </div>
        </div>
    )
}
