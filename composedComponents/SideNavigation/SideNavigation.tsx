import React, { useEffect, useState } from 'react'
import { Profile } from '@/lib/database-helpers.types'
import { usePathname } from 'next/navigation'
import {BookOpenText, Books, Info, Question} from '@phosphor-icons/react'
import useDevice from "@/customHooks/useDevice";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {useRouter} from "next/router";
import {neutral800} from "@/assets/colorPallet/colors";
import RecordButton from "@/composedComponents/RecordButton/RecordButton";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useStory} from "@/contexts/story/StoryContext";
import STKButton from "@/components/STKButton/STKButton"
import {Divider} from "@mui/material";
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import HelperDialog from "@/composedComponents/HelperDialog/HelperDialog";

const navigationOptions = [
    { text: "Discover", icon: <BookOpenText size={24} color={neutral800} />, pathname: "/discover"  },
    { text: "My Library", icon: <Books size={24} weight="duotone" color={neutral800} />, pathname: "/library" },
    { text: "Collections", icon: <CollectionsBookmarkOutlinedIcon sx={{ width: "20px", height: "20px", color: neutral800 }} />, pathname: "/collections" },
]

export default function SideNavigation() {
    // Hooks
    const pathname = usePathname()
    const { onMobile } = useDevice()
    const route = useRouter()

    // Context
    const { currentProfile } = useProfile()
    const { setStoryFilters } = useStory()

    // States
    const [showHelperDialog, setShowHelperDialog] = useState(false)
    const [profileOptions, setProfileOptions] = useState<Profile[]>([])
    const [selectedNavigationOption, setSelectedNavigationOption] = useState<Object>({})

    // Mount
    useEffect(() => {
        // @ts-ignore
        setSelectedNavigationOption(navigationOptions.find((navigationOption) => {
            return navigationOption.pathname === pathname
        }))
    }, [])

    // Methods
    const handleTabOnChange = async (selectedTab: any) => {
        await route.push(selectedTab.pathname)
        setStoryFilters({})
    }


    return (
        <nav>
            <div>
                <div key={currentProfile?.profile_id}>
                    {!currentProfile ? (
                        <STKSkeleton width="70%" height="20px" />
                    ) : (
                        <h2 className="m-0 text-base hidden lg:block">Hi, {currentProfile?.profile_name}!</h2>
                    )}

                    <div
                    style={{ boxShadow: onMobile ? "1px 1px 8px #00000024" : '' }}
                    className="nav lg:mt-8 w-full lg:w-auto flex lg:flex-col bg-white lg:bg-transparent justify-center py-6 px-6 lg:p-0 left-0 lg:left-auto fixed z-10 lg:relative bottom-0 lg:bottom-auto">
                       <div className="flex justify-center lg:flex-col -ml-10 lg:ml-0">
                           <STKButtonTabs
                               tabs={navigationOptions}
                               initialValue={selectedNavigationOption}
                               onChange={handleTabOnChange}
                           />

                           <div className="lg:mt-6 ml-4 lg:ml-0 lg:w-full">
                               <RecordButton onClick={() => route.push("/record")} />
                           </div>
                           <div className="pt-10 pb-6">
                               <Divider />
                           </div>

                           <div>
                               <STKButton
                                   startIcon={<Question />}
                                   alignStart
                                   variant="none"
                                   active={route.pathname === "/faq"}
                                   onClick={() => setShowHelperDialog(true)}>
                                   Help
                               </STKButton>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
            <HelperDialog active={showHelperDialog} onClose={() => setShowHelperDialog(false)} />
        </nav>
    )
}
