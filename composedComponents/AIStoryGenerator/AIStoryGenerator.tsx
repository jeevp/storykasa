import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import AIStoryGeneratorDialog from "@/composedComponents/AIStoryGenerator/AIStoryGeneratorDialog";
import {useEffect, useState} from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useDevice from "@/customHooks/useDevice";
import AIStoryIdeaList from "@/composedComponents/AIStoryGenerator/AIStoryIdeaList";
import StoryIdeasHandler from "@/handlers/StoryIdeasHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import StoryIdeasHistory from "@/composedComponents/StoryIdeasHistoryDialog/StoryIdeasHistory";

export default function AIStoryGenerator({ onSelect = () => ({}) }: { onSelect: (storyIdea: any) => void }) {
    const { onMobile } = useDevice()

    // Contexts
    const { currentProfileId } = useProfile()

    // States
    const [storyIdeas, setStoryIdeas] = useState([])
    const [showStoryIdeasHistoryDialog, setShowStoryIdeasHistoryDialog] = useState(false)
    const [
        showAIStoryGeneratorDialog,
        setShowAIStoryGeneratorDialog
    ] = useState(false)

    // Mounted
    useEffect(() => {
        handleFetchStoryIdeas()
    }, []);

    // Methods
    const handleFetchStoryIdeas = async () => {
        const response = await StoryIdeasHandler.fetchStoryIdeas({ profileId: currentProfileId, page: 1 })
        setStoryIdeas(response.storyIdeas)
    }

    const handleOnSelect = (storyIdea: any) => {
        onSelect(storyIdea)
    }

    const handleStoryIdeasOnChange = (_storyIdeas: any) => {
        setStoryIdeas(_storyIdeas)
    }

    return (
        <div>
            <STKCard>
                <div className="p-4 flex flex-col lg:flex-row justify-between items-center">
                    <label>Need some help getting started? Generate a story idea and then finish it yourself!</label>
                    <div className="mt-4 lg:mt-0 w-full lg:w-auto">
                        <STKButton
                        color="aiMode"
                        fullWidth={onMobile}
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() => setShowAIStoryGeneratorDialog(true)}>Try our AI idea generator</STKButton>
                    </div>
                </div>
            </STKCard>
            {storyIdeas.length > 0 ? (
                <div className="mt-4">
                    <label className="font-semibold">Story ideas history</label>
                    <div className="mt-4">
                        <AIStoryIdeaList storyIdeas={storyIdeas.slice(0,3)} onSelect={handleOnSelect} />
                        <div className="mt-4 flex justify-end">
                            <STKButton fullWidth={onMobile} variant="outlined" onClick={() => setShowStoryIdeasHistoryDialog(true)}>
                                Open full story idea history
                            </STKButton>
                        </div>
                    </div>
                </div>
            ) : null}
            <AIStoryGeneratorDialog
            active={showAIStoryGeneratorDialog}
            onSelect={handleOnSelect}
            onChange={handleStoryIdeasOnChange}
            onClose={() => setShowAIStoryGeneratorDialog(false)} />
            <StoryIdeasHistory
            active={showStoryIdeasHistoryDialog}
            onSelect={handleOnSelect}
            onClose={() => setShowStoryIdeasHistoryDialog(false)} />
        </div>
    )
}
