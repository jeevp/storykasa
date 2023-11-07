import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import ProfileContext from "@/contexts/ProfileContext";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import AccountSideDrawer from "@/composedComponents/AccountSideDrawer/AccountSideDrawer";
import { ArrowSquareRight } from '@phosphor-icons/react'
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";

export default function AccountDetails() {
    const router = useRouter()
    const { currentProfile } = useContext(ProfileContext)

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
