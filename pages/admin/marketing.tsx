import PageWrapper from '@/composedComponents/PageWrapper'
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import {useState} from "react";
import withAdmin from "@/HOC/withAdmin";
import {AnimatePresence, motion} from "framer-motion";
import STKButton from "@/components/STKButton/STKButton";
import GenerateGuestAccessLinkDialog
    , {
    STORY_LISTENING_DEMO_LINK_TYPE, STORY_RECORDING_DEMO_LINK_TYPE
} from "@/composedComponents/GenerateGuestAccessLinkDialog/GenerateGuestAccessLinkDialog";

export const dynamic = 'force-dynamic'
function Marketing() {
    // States
    const [showGenerateGuestAccessLinkDialog, setShowGenerateGuestAccessLinkDialog] = useState(false)
    const [demoLinkType, setDemoLinkType] = useState("")

    // Methods
    const handleGuestAccessLink = (demoLink: string) => {
        setShowGenerateGuestAccessLinkDialog(true)
        setDemoLinkType(demoLink)
    }


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
                                        <h3 className="text-lg">Demo links</h3>
                                        <div className="mt-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="font-semibold text-md">Story listening</label>
                                                    <p className="mt-2 text-md">Use the link to demo the story listening feature</p>
                                                </div>

                                                <div className="mt-4">
                                                    <STKButton onClick={() => handleGuestAccessLink(STORY_LISTENING_DEMO_LINK_TYPE)}>
                                                        Generate Guest Access Link
                                                    </STKButton>
                                                </div>
                                            </div>
                                            <div className="w-full border-t my-4 border-t-neutral-300 border-0 border-solid" />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="font-semibold text-md">Story recording</label>
                                                    <p className="mt-2 text-md">Use the link to demo the story recording feature</p>
                                                </div>

                                                <div className="mt-4">
                                                    <STKButton onClick={() => handleGuestAccessLink(STORY_RECORDING_DEMO_LINK_TYPE)}>
                                                        Generate Guest Access Link
                                                    </STKButton>
                                                </div>
                                            </div>
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
            demoLinkType={demoLinkType}
            onClose={() => setShowGenerateGuestAccessLinkDialog(false)}/>
        </>
    )
}

export default withAuth(withProfile(withAdmin(Marketing)))
