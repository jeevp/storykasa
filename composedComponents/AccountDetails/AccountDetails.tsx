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
    const { currentProfile } = useContext(ProfileContext)

    const [showAccountSideDrawer, setShowAccountSideDrawer] = useState(false)
    console.log({ currentProfile })

    return (
        <div className="flex items-center">
            <div>
                {currentProfile ? (
                    <STKButton
                    color="info"
                    variant="text"
                    startIcon={<STKAvatar src={currentProfile?.avatar_url as string}
                    name={currentProfile?.profile_name} />}
                    onClick={() => setShowAccountSideDrawer(true)}>
                        <label className="hidden lg:flex">{currentProfile?.profile_name}</label>
                        <span className="ml-2 flex items-center">
                            <ArrowSquareRight size={20} />
                        </span>
                    </STKButton>
                ) : (
                    <STKButton color="info" iconButton onClick={() => setShowAccountSideDrawer(true)}>
                        <ArrowSquareRight size={20} />
                    </STKButton>
                )}
            </div>
            <AccountSideDrawer
            open={showAccountSideDrawer}
            onClose={() => setShowAccountSideDrawer(false)} />
        </div>
    )
}
