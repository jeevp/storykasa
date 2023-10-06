import { useContext, useEffect, useState } from 'react'
import { Profile } from '@/lib/database-helpers.types'
import ProfileEditor from '../ProfileEditor/ProfileEditor'
import { PencilSimple, Plus } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import {Avatar} from "@mui/material";
import STKButton from "@/components/STKButton/STKButton";
import ProfileContext from "@/contexts/ProfileContext";
import {STK_PROFILE_ID} from "@/config";
import ProfileCard from "@/composedComponents/ProfileCard/ProfileCard";

export default function ProfileSwitcher({ profiles, managing }: { profiles: Profile[], managing: boolean }) {
    // Context
    const { setCurrentProfileId, setCurrentProfile } = useContext(ProfileContext) as any

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
        setCurrentProfileId(id)
        setCurrentProfile(profile)
        localStorage.setItem(STK_PROFILE_ID, id)
        router.push('/library')
    }

    const addProfile = () => {
        setEditing(true)
    }


    return (
        <div className="mt-5 flex-col">
            <div className="flex items-start flex-col lg:flex-row">
                {profileOptions.map((profile: Profile) => (
                    <div key={profile?.profile_id} className="lg:ml-4 mt-2 w-full lg:w-auto lg:mt-2 first:ml-0">
                        <ProfileCard
                            managing={managing}
                            name={profile?.profile_name}
                            avatarURL={profile?.avatar_url}
                            onEdit={() => editProfile(profile.profile_id)}
                            onSelect={() => selectProfile(profile)} />
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
