import PageWrapper from '@/composedComponents/PageWrapper'
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import {useAdmin} from "@/contexts/admin/useAdmin";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import PublicStoryRequestCard from "@/composedComponents/PublicStoryRequestCard/PublicStoryRequestCard";
import PublicStoryRequestCardSkeleton from "@/composedComponents/PublicStoryRequestCard/PublicStoryRequestCardSkeleton";
import withAdmin from "@/HOC/withAdmin";
import Story from "@/models/Story";
import {useStory} from "@/contexts/story/StoryContext";
import {AnimatePresence, motion} from "framer-motion";
import StoryCard, {ADD_TO_LIBRARY_MENU_OPTION} from "@/composedComponents/StoryCard/StoryCard";
import {SmileyMeh} from "@phosphor-icons/react";
import {neutral300} from "@/assets/colorPallet/colors";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import StoryCardSkeleton from "@/composedComponents/StoryCard/StoryCardSkeleton";
import StoryDetails from "@/composedComponents/StoryDetails/StoryDetails";
import useDevice from "@/customHooks/useDevice";
import STKButton from "@/components/STKButton/STKButton";
import GenerateGuestAccessLinkDialog
    from "@/composedComponents/GenerateGuestAccessLinkDialog/GenerateGuestAccessLinkDialog";

export const dynamic = 'force-dynamic'

function Marketing() {
    const { onMobile } = useDevice()

    // States
    const [showGenerateGuestAccessLinkDialog, setShowGenerateGuestAccessLinkDialog] = useState(false)


    return (
        <>
            <PageWrapper admin path="discover">
                <div className="pb-20">
                    <h2 className="m-0">
                        Marketing
                    </h2>
                    <div className="mt-10">
                        <div className="flex sm:w-full pb-32 lg:pb-0">
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                >
                                    <div>
                                        <label className="font-semibold text-lg">Story listening</label>
                                        <p className="mt-2 text-md">Click the button bellow to generate a guest access link for a specific story</p>
                                        <div className="mt-4">
                                            <STKButton onClick={() => setShowGenerateGuestAccessLinkDialog(true)}>Generate Guest Access Link</STKButton>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </PageWrapper>
            <GenerateGuestAccessLinkDialog
            open={showGenerateGuestAccessLinkDialog}
            onClose={() => setShowGenerateGuestAccessLinkDialog(false)}/>
        </>
    )
}

export default withAuth(withProfile(withAdmin(Marketing)))
