'use client'

import { Account, Profile } from '@/lib/database-helpers.types'
import { useRouter } from 'next/navigation'

import { useContext, useEffect, useState } from 'react'
import ProfileContext from "@/contexts/ProfileContext";
import ProfileHandler from "@/handlers/ProfileHandler";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import AccountSideDrawer from "@/composedComponents/AccountSideDrawer/AccountSideDrawer";
import { ArrowSquareRight } from '@phosphor-icons/react'

export default function AccountDetails({ account }: { account: Account }) {
    const router = useRouter()

    const { currentProfileId, setCurrentProfileId } = useContext(ProfileContext)
    const [showAccountSideDrawer, setShowAccountSideDrawer] = useState(false)
    const [profileOptions, setProfileOptions] = useState<Profile[]>([])

    const loadProfiles = async () => {
        const profiles: Profile[] = await ProfileHandler.fetchProfiles()
        setProfileOptions(profiles)
    }

    const currentProfile = profileOptions?.find(
        (p) => p.profile_id === currentProfileId
    )

    useEffect(() => {
        loadProfiles()
    }, [currentProfileId])


    return (
        <div className="flex items-center">
            {/*<HelpDialog></HelpDialog>*/}
            <div>
                <STKButton color="info" variant="text" startIcon={<STKAvatar src={currentProfile?.avatar_url as string} name={currentProfile?.profile_name} />} onClick={() => setShowAccountSideDrawer(true)}>
                    Felipe Fernandes
                    <span className="ml-2 flex items-center">
                        <ArrowSquareRight size={20} />
                    </span>
                </STKButton>
            </div>
            <AccountSideDrawer open={showAccountSideDrawer} onClose={() => setShowAccountSideDrawer(false)} />
        </div>
    )
}
