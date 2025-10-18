import React, {useEffect, useState, useRef} from 'react';
import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import StoryHandler from "@/handlers/StoryHandler";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKSnackbar from "@/components/STKSnackbar/STKSnackbar";
import STKTabs from "@/components/STKTabs/STKTabs";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useStory} from "@/contexts/story/StoryContext";
import Story from "@/models/Story";


interface DeleteStoryDialogProps {
    open: boolean;
    story: any;
    onClose?: () => void;
    onSuccess?: () => void;
}

export default function UpdateStoryDialog({
    open,
    story,
    onClose = () => ({}),
    onSuccess = () => ({})
}: DeleteStoryDialogProps) {
    const { onMobile } = useDevice()
    const { setSnackbarBus } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [narratorName, setNarratorName] = useState("")
    const [transcript, setTranscript] = useState<Array<{start: number, end: number, text: string}>>([])
    const [activeTab, setActiveTab] = useState(0)
    const [transcriptLoading, setTranscriptLoading] = useState(false)
    const transcriptLoadingRef = useRef<boolean>(false)

    const { privateStories, setPrivateStories } = useStory()
    const { currentProfileId } = useProfile()
    const { setStoryNarrators, setStoryLanguages } = useStory()

    // Watchers
    useEffect(() => {
        if (story) {
            setTitle(story?.title)
            setDescription(story?.description)
            setNarratorName(story?.narratorName)
            loadTranscript()
        }
    }, [story]);

    // Reset loading ref when story changes
    useEffect(() => {
        transcriptLoadingRef.current = false;
    }, [story?.storyId]);

    const loadTranscript = async () => {
        if (!story?.storyId) return
        
        // Prevent multiple simultaneous requests
        if (transcriptLoadingRef.current) {
            console.log("Transcript already loading, skipping...");
            return;
        }
        
        try {
            transcriptLoadingRef.current = true;
            setTranscriptLoading(true)
            const transcriptData = await StoryHandler.getStoryTranscript(story.storyId)
            setTranscript(transcriptData || [])
        } catch (error) {
            console.error('Error loading transcript:', error)
            setTranscript([])
        } finally {
            setTranscriptLoading(false)
            transcriptLoadingRef.current = false;
        }
    }

    // Methods
    const handleOnChange = (key: string, value: string) => {
        if (key === "title") setTitle(value)
        if (key === "description") setDescription(value)
        if (key === "narratorName") setNarratorName(value)
    }

    const handleTranscriptChange = (index: number, text: string) => {
        const updatedTranscript = [...transcript]
        updatedTranscript[index] = {
            ...updatedTranscript[index],
            text: text
        }
        setTranscript(updatedTranscript)
    }

    const handleTabChange = (tab: any) => {
        setActiveTab(tab.value)
        return {}
    }

    const handleFetchStoryFilters = async () => {
        const { narrators, languages } = await StoryHandler.fetchStoriesFilters({
            profileId: currentProfileId
        })

        setStoryNarrators(narrators)
        setStoryLanguages(languages)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            
            // Update story basic info
            await StoryHandler.updateStory({ storyId: story.storyId }, {
                title,
                description,
                narratorName
            })

            // Update transcript if we're on the transcription tab
            if (activeTab === 1 && transcript.length > 0) {
                await StoryHandler.updateStoryTranscript({ storyId: story.storyId }, transcript)
            }

            handleFetchStoryFilters()

            const _privateStories = privateStories.map((privateStory: Story) => {
                if (privateStory.storyId === story.storyId) {
                    return new Story({
                        ...privateStory,
                        title: title || privateStory.title,
                        description: description || privateStory.description,
                        narratorName: narratorName || privateStory.narratorName
                    })
                }

                return privateStory
            })

            // @ts-ignore
            setPrivateStories([..._privateStories])

            setSnackbarBus({
                active: true,
                message: "Story updated with success",
                type: "success"
            })

            onSuccess()
            onClose()
        } finally {
            setLoading(false)
        }
    }


    const tabs = [
        { label: "About the story", value: 0 },
        { label: "Transcription", value: 1 }
    ]

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <STKDialog
        active={open}
        maxWidth="md"
        title="Edit story"
        fullScreen={onMobile}
        onClose={() => onClose()}>
            <div>
                <div className="mt-6">
                    <STKTabs 
                        tabs={tabs} 
                        value={activeTab} 
                        onChange={handleTabChange}
                    />
                    
                    {activeTab === 0 && (
                        <div className="mt-6">
                            <div>
                                <label className="font-semibold">Title</label>
                                <div className="mt-2">
                                    <STKTextField
                                    fluid
                                    value={title}
                                    placeholder="Type the story title"
                                    onChange={(value: string) => handleOnChange("title", value)}/>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="font-semibold">Narrator name</label>
                                <div className="mt-2">
                                    <STKTextField
                                        fluid
                                        value={narratorName}
                                        placeholder="Type the narrator name"
                                        onChange={(value: string) => handleOnChange("narratorName", value)}/>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="font-semibold">Description</label>
                                <div className="mt-2">
                                    <STKTextField
                                    fluid
                                    multiline
                                    enableRichText
                                    value={description}
                                    maxRows={20}
                                    placeholder="Type the story description"
                                    onChange={(value: string) => handleOnChange("description", value)}/>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 1 && (
                        <div className="mt-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg">Story Transcript</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Edit the transcript text for each segment. You can modify the text while keeping the timing information.
                                </p>
                            </div>
                            
                            {transcriptLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="text-gray-500">Loading transcript...</div>
                                </div>
                            ) : transcript.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No transcript available for this story.
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {transcript.map((segment, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Segment {index + 1}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(segment.start)} - {formatTime(segment.end)}
                                                </span>
                                            </div>
                                            <STKTextField
                                                fluid
                                                multiline
                                                value={segment.text}
                                                placeholder="Enter transcript text..."
                                                onChange={(value: string) => handleTranscriptChange(index, value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
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
                        loading={loading}
                        onClick={handleSave}>
                            Save
                        </STKButton>
                    </div>
                </div>
            </div>
            <STKSnackbar
            open={showSnackbar}
            message="Story updated with success"
            onClose={() => setShowSnackbar(false)} />
        </STKDialog>
    )
}
