import STKDrawer from "@/components/STKDrawer/STKDrawer";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import { UserSwitch, SignOut } from '@phosphor-icons/react'
import { STK_PROFILE_ID, STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from "@/config"
import AuthHandler from "@/handlers/AuthHandler";
import {useRouter} from "next/router";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useAuth} from "@/contexts/auth/AuthContext";


interface AccountSideDrawerProps {
    open: boolean
    onClose: () => void
}

export default function AccountSideDrawer({ open, onClose = () => ({}) }: AccountSideDrawerProps) {
    const router = useRouter()

    const { setCurrentUser } = useAuth()
    const { setCurrentProfileId, currentProfile, setCurrentProfile } = useProfile()

    const handleLogout = async () => {
        localStorage.removeItem(STK_PROFILE_ID)
        localStorage.removeItem(STK_ACCESS_TOKEN)
        localStorage.removeItem(STK_REFRESH_TOKEN)
        await AuthHandler.signOut()

        setCurrentUser(null)
        setCurrentProfileId(null)
        setCurrentProfile(null)

        await router.push('/')
    }

    const goToProfilesPage = async () => {
        await router.push("/profiles")
    }

    return (
        <STKDrawer open={open} onClose={() => onClose()} anchor="right">
            <div className="w-52 lg:w-72 p-10">
                {currentProfile && (
                    <div className="flex items-center mb-10">
                        <STKAvatar src={
                            // @ts-ignore
                            currentProfile?.avatar_url
                        } name={
                            // @ts-ignore
                            currentProfile?.profile_name
                        } />
                        <label className="ml-2">{
                            // @ts-ignore
                            currentProfile?.profile_name
                        }</label>
                    </div>
                )}
                <div>
                    {currentProfile && (
                        <div className="mb-4">
                            <STKButton
                                alignStart
                                startIcon={<UserSwitch size={20} />}
                                fullWidth
                                color="info"
                                variant="outlined"
                                onClick={goToProfilesPage}>
                                Change profile
                            </STKButton>
                        </div>
                    )}
                    <div>
                        <STKButton
                        alignStart
                        color="info"
                        startIcon={<SignOut size={20} />}
                        fullWidth
                        variant="outlined"
                        onClick={handleLogout}>
                            Logout
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDrawer>
    )
}
