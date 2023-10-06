import STKDrawer from "@/components/STKDrawer/STKDrawer";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import { UserSwitch, SignOut } from '@phosphor-icons/react'
import { STK_PROFILE_ID, STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from "@/config"
import AuthHandler from "@/handlers/AuthHandler";
import {useRouter} from "next/router";
import {useContext} from "react";
import AuthContext from "@/contexts/AuthContext";
import ProfileContext from "@/contexts/ProfileContext";

export default function AccountSideDrawer({ open, onClose = () => ({}) }) {
    const router = useRouter()

    const { setCurrentUser } = useContext(AuthContext)
    const { setCurrentProfileId, currentProfile, setCurrentProfile } = useContext(ProfileContext)

    const handleLogout = async () => {
        localStorage.removeItem(STK_PROFILE_ID)
        localStorage.removeItem(STK_ACCESS_TOKEN)
        localStorage.removeItem(STK_REFRESH_TOKEN)
        await AuthHandler.signOut()
        setCurrentUser(null)
        setCurrentProfileId(null)
        setCurrentProfile(null)

        router.push('/')
    }

    const goToProfilesPage = async () => {
        await router.push("/profiles")
    }

    return (
        <STKDrawer open={open} onClose={() => onClose()} anchor="right">
            <div className="w-52 lg:w-72 p-10">
                <div className="flex items-center">
                    <STKAvatar src={currentProfile?.avatar_url} name={currentProfile?.profile_name} />
                    <label className="ml-2">{currentProfile?.profile_name}</label>
                </div>
                <div className="mt-10">
                    <div>
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
                    <div className="mt-4">
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
