import STKDrawer from "@/components/STKDrawer/STKDrawer";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import {UserSwitch, SignOut, BookOpenText, Books, Info, Question, Video} from '@phosphor-icons/react'
import { STK_PROFILE_ID, STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from "@/config"
import AuthHandler from "@/handlers/AuthHandler";
import {useRouter} from "next/router";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useAuth} from "@/contexts/auth/AuthContext";
import RecordButton from "@/composedComponents/RecordButton/RecordButton";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {neutral800} from "@/assets/colorPallet/colors";
import React, {useState} from "react";
import {useStory} from "@/contexts/story/StoryContext";
import {Divider} from "@mui/material";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import HelperDialog from "@/composedComponents/HelperDialog/HelperDialog";

interface AccountSideDrawerProps {
    open: boolean
    onClose: () => void
}

const navigationOptions = [
    { text: "Discover", icon: <BookOpenText size={24} color={neutral800} />, pathname: "/discover"  },
    { text: "My Library", icon: <Books size={24} weight="duotone" color={neutral800} />, pathname: "/library" },
    { text: "Collections", icon: <CollectionsBookmarkOutlinedIcon sx={{ width: "20px", height: "20px", color: neutral800 }} />, pathname: "/collections" },
]


export default function AccountSideDrawer({ open, onClose = () => ({}) }: AccountSideDrawerProps) {
    const router = useRouter()

    const [showHelperDialog, setShowHelperDialog] = useState(false)
    const { setCurrentUser, currentUserIsAdmin, currentUser } = useAuth()
    const { setCurrentProfileId, currentProfile, setCurrentProfile } = useProfile()
    const [selectedNavigationOption, setSelectedNavigationOption] = useState<Object>({})
    const { setStoryFilters } = useStory()

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

    const goToAccountSettingsPage = async () => {
        await router.push("/account-settings")
    }

    const handleTabOnChange = async (selectedTab: any) => {
        await router.push(selectedTab.pathname)
        setStoryFilters({})
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
                        <div>
                            <STKButtonTabs
                                tabs={navigationOptions}
                                initialValue={selectedNavigationOption}
                                onChange={handleTabOnChange}
                            />
                            <div className="mt-4">
                                <RecordButton onClick={() => router.push("/record")} />
                            </div>
                        </div>
                    )}
                    <div className="py-6 mt-1">
                        <Divider />
                    </div>
                    {currentProfile && (
                        <div>
                            <div>
                                <STKButton
                                    alignStart
                                    startIcon={<UserSwitch size={20} />}
                                    fullWidth
                                    color="info"
                                    variant=""
                                    onClick={goToProfilesPage}>
                                    Change profile
                                </STKButton>
                            </div>
                            <div className="mt-4">
                                <STKButton
                                    alignStart
                                    // @ts-ignore
                                    startIcon={<SettingsIcon size={20} />}
                                    fullWidth
                                    color="info"
                                    variant=""
                                    onClick={goToAccountSettingsPage}>
                                    Account settings
                                </STKButton>
                            </div>
                            <div className="mt-4">
                                <STKButton
                                    startIcon={<Info />}
                                    alignStart
                                    color="info"
                                    variant=""
                                    fullWidth
                                    onClick={() => router.push("/faq")}>
                                    FAQ
                                </STKButton>
                            </div>
                            <div className="mt-4">
                                <STKButton
                                    startIcon={<Video />}
                                    alignStart
                                    color="info"
                                    variant=""
                                    fullWidth
                                    onClick={() => router.push("/help-videos")}>
                                    Help videos
                                </STKButton>
                            </div>
                            <div className="mt-4">
                                <a className="text-neutral-800 no-underline" href={`https://storykasa.com/about-us`} target="_blank">
                                    <STKButton
                                        startIcon={<Info />}
                                        alignStart
                                        color="info"
                                        variant=""
                                        fullWidth
                                        onClick={() => ({})}>
                                        About us
                                    </STKButton>
                                </a>
                            </div>
                            <div className="mt-4">
                                <STKButton
                                    startIcon={<Question />}
                                    alignStart
                                    color="info"
                                    variant=""
                                    fullWidth
                                    onClick={() => setShowHelperDialog(true)}>
                                    Help
                                </STKButton>
                            </div>
                        </div>
                    )}
                    {currentUserIsAdmin && (
                        <>
                            <div className="py-6">
                                <Divider />
                            </div>
                            <STKButton
                                startIcon={<AdminPanelSettingsOutlinedIcon />}
                                alignStart
                                color="info"
                                variant=""
                                fullWidth
                                onClick={() => router.push("/admin/public-story-requests")}>
                                Admin
                            </STKButton>
                        </>
                    )}

                    <div className="py-6">
                        <Divider />
                    </div>
                    <div className="">
                        <STKButton
                        alignStart
                        color="info"
                        startIcon={<SignOut size={20} />}
                        fullWidth
                        variant=""
                        onClick={handleLogout}>
                            Logout
                        </STKButton>
                    </div>
                </div>
            </div>
            <HelperDialog active={showHelperDialog} onClose={() => setShowHelperDialog(false)} />
        </STKDrawer>
    )
}
