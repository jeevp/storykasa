import { useEffect, useState } from 'react'
import { Profile } from '@/lib/database-helpers.types'
import ProfileEditor from '../ProfileEditor/ProfileEditor'
import { Plus } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import STKButton from "@/components/STKButton/STKButton";
import {STK_PROFILE_ID} from "@/config";
import ProfileCard from "@/composedComponents/ProfileCard/ProfileCard";
import STKCard from "@/components/STKCard/STKCard";
import useDevice from "@/customHooks/useDevice";
import {MAX_PROFILES_ALLOWED} from "@/models/Profile";
import {useProfile} from "@/contexts/profile/ProfileContext";

export default function ProfileSwitcher({ profiles, managing }: { profiles: Profile[], managing: boolean }) {
    // Context
    const { setCurrentProfileId, setCurrentProfile } = useProfile()

    // Hooks
    const router = useRouter()
    const { onMobile } = useDevice()

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
        <div className="mt-5 flex-col pb-10 lg:pb-0">
            <div className="flex items-start flex-col lg:flex-row flex-wrap">
                {profileOptions?.map((profile: Profile) => (
                    <div key={profile?.profile_id} className="lg:mr-4 w-full lg:w-auto mb-4">
                        <ProfileCard
                            managing={managing}
                            name={profile?.profile_name}
                            avatarURL={profile?.avatar_url || ""}
                            onEdit={() => editProfile(profile.profile_id)}
                            onSelect={() => selectProfile(profile)} />
                    </div>
                ))}

                {managing && !editing && profiles?.length < MAX_PROFILES_ALLOWED ? (
                    <div className="mr-0 lg:mr-4 mb-4 lg:mb-0 w-full lg:w-auto">
                        <STKCard color="transparent">
                            <div
                            className="flex flex-col items-center justify-center cursor-pointer"
                            style={{ height: "258px", width: onMobile ? "100%" :"274px" }}>
                                <STKButton
                                    iconButton
                                    height="88px"
                                    width="88px"
                                    onClick={addProfile}
                                >
                                    <Plus size={24} weight="bold"></Plus>
                                </STKButton>
                            </div>
                        </STKCard>
                    </div>
                ): null}
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
