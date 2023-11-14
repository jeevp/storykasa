import { useState } from 'react'
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import AccountSideDrawer from "@/composedComponents/AccountSideDrawer/AccountSideDrawer";
import { ArrowSquareRight } from '@phosphor-icons/react'
import {useProfile} from "@/contexts/profile/ProfileContext";

export default function AccountDetails() {
    const { currentProfile } = useProfile()

    const [showAccountSideDrawer, setShowAccountSideDrawer] = useState(false)

    return (
        <div className="flex items-center">
            <div>
                {currentProfile ? (
                    <STKButton
                    color="info"
                    variant="text"
                    // @ts-ignore
                    startIcon={<STKAvatar src={currentProfile?.avatar_url as string}
                    // @ts-ignore
                    name={currentProfile?.profile_name} />}
                    onClick={() => setShowAccountSideDrawer(true)}>
                        <label className="hidden lg:flex">
                            {
                                // @ts-ignore
                                currentProfile?.profile_name
                            }
                        </label>
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
