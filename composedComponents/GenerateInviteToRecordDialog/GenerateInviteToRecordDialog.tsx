import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import {useStory} from "@/contexts/story/StoryContext";
import Story from "@/models/Story";
import encodeJWT from "@/utils/encodeJWT";
import Library from "@/models/Library";
import AuthHandler from "@/handlers/AuthHandler";

export const STORY_LISTENING_DEMO_LINK_TYPE = "STORY_LISTENING_DEMO_LINK_TYPE"
export const STORY_RECORDING_DEMO_LINK_TYPE = "STORY_RECORDING_DEMO_LINK_TYPE"


interface InviteToRecordDialogProps {
    open: boolean;
    library?: Library;
    onClose?: () => void;
}

export default function GenerateInviteToRecordDialog({
    open,
    library,
    onClose = () => ({}),
}: InviteToRecordDialogProps) {
    const { onMobile } = useDevice()

    // Contexts
    const { publicStories, setPublicStories } = useStory()

    // States
    const [loading, setLoading] = useState(false)
    const [selectedStory, setSelectedStory] = useState<Story | null>(null)
    const [guestAccessLink, setGuestAccessLink] = useState("")
    const [linkCopied, setLinkCopied] = useState(false)

    useEffect(() => {
        if (!open) {
            setGuestAccessLink("")
            setLinkCopied(false)
            setSelectedStory(null)
            setLoading(false)
        } else {
            generateGuestAccessLink()
        }
    }, [open]);

    // Methods
    const generateGuestAccessLink = async () => {
        setLoading(true)

        const { guestAccessToken } = await AuthHandler.generateGuestAccessToken({
            allowRecording: true,
            libraryId: library?.libraryId,
            organizationId: library?.organizationId
        })

        setGuestAccessLink(`${location.origin}/record?guestAccessToken=${guestAccessToken}`)
        setLoading(false)
    }

    const copyLink = async () => {
        if (navigator.clipboard && guestAccessLink) {
            await navigator.clipboard.writeText(guestAccessLink)
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    }




    return (
        <STKDialog
            active={open}
            maxWidth="sm"
            title="Invite to Record"
            fullScreen={onMobile}
            onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <label className="text-md">
                        You can use the following public link to allow anyone to record a story to this collection
                    </label>
                    <div className="mt-4 p-4 rounded-2xl bg-neutral-100 max-w-lg overflow-hidden text-ellipsis">
                        {loading ? "Generating Public Link..." :  <a className="whitespace-nowrap">{guestAccessLink}</a>}

                    </div>
                    <div className="mt-8 flex justify-end">
                        <STKButton onClick={copyLink}>
                            {linkCopied ? 'Copied' : 'Copy Public Link'}
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
