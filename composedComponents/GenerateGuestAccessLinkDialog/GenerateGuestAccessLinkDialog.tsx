import React, {useEffect, useState} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import {useStory} from "@/contexts/story/StoryContext";
import Story from "@/models/Story";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import encodeJWT from "@/utils/encodeJWT";


interface GenerateGuestAccessLinkDialogProps {
    open: boolean;
    onClose?: () => void;
}

export default function GenerateGuestAccessLinkDialog({
    open,
    onClose = () => ({}),
}: GenerateGuestAccessLinkDialogProps) {
    const { onMobile } = useDevice()

    // Contexts
    const { publicStories, setPublicStories } = useStory()

    // States
    const [loading, setLoading] = useState(false)
    const [selectedStory, setSelectedStory] = useState<Story | null>(null)
    const [guestAccessLink, setGuestAccessLink] = useState("")
    const [linkCopied, setLinkCopied] = useState(false)


    // Mounted
    useEffect(() => {
        loadStories()
    }, []);

    // Methods
    const loadStories = async () => {
        const _publicStories: Story[] = await StoryHandler.fetchPublicStories({})
        // @ts-ignore
        setPublicStories(_publicStories)
    }

    const generateGuestAccessLink = () => {
        setLoading(true)
        const accessToken = encodeJWT({
            // @ts-ignore
            storyId: selectedStory?.storyId,
            isGuest: true,
            allowRecording: false,
            email: "",
            sub: "guest-user",
            name: ""
        })

        setGuestAccessLink(`${location.origin}/discover?guestAccessToken=${accessToken}`)
    }

    const handleStoryOnSelect = (story: Story) => {
        setSelectedStory(story)
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
        title="Generate Guest Access Link"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                {guestAccessLink ? (
                    <div className="mt-6">
                        <label className="font-semibold">Guest access link</label>
                        <div className="mt-2 overflow-hidden w-[500px] text-ellipsis">
                            <a href={guestAccessLink} className="whitespace-nowrap text-[#3d996d] cursor">{guestAccessLink}</a>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <STKButton onClick={copyLink}>{linkCopied ? "Copied" : "Copy link"}</STKButton>
                        </div>
                    </div>
                ) : (
                  <>
                      <div className="mt-6">
                          <div>
                              <label className="font-semibold">Story</label>
                              <div className="mt-2">
                                  <STKAutocomplete
                                      disablePortal={false}
                                      // @ts-ignore
                                      options={publicStories.filter((story) => story.recordingUrl)}
                                      optionLabel="title"
                                      onChange={handleStoryOnSelect}/>
                              </div>
                          </div>
                      </div>
                      <div className="mt-8 flex items-center justify-end flex-col lg:flex-row">
                          <div className="w-full lg:w-auto">
                              <STKButton fullWidth={onMobile} variant="outlined" onClick={() => onClose()}>
                                  Cancel
                              </STKButton>
                          </div>
                          <div className="lg:ml-2 ml-0 mt-2 lg:mt-0 w-full lg:w-auto">
                              <STKButton
                                  fullWidth={onMobile}
                                  color="primary"
                                  disabled={!selectedStory}
                                  loading={loading}
                                  onClick={generateGuestAccessLink}>
                                  Generate link
                              </STKButton>
                          </div>
                      </div>
                  </>
                )}
            </div>
        </STKDialog>
    )
}
