import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import AIStoryGeneratorDialog from "@/composedComponents/AIStoryGenerator/AIStoryGeneratorDialog";
import {useEffect, useState} from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useDevice from "@/customHooks/useDevice";
import AIStoryIdeaList from "@/composedComponents/AIStoryGenerator/AIStoryIdeaList";
import StoryIdeasHandler from "@/handlers/StoryIdeasHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";

export default function AIStoryGenerator({ onSelect = () => ({}) }: { onSelect: (storyIdea: any) => void }) {
    const { onMobile } = useDevice()

    // Contexts
    const { currentProfileId } = useProfile()

    // States
    const [storyIdeas, setStoryIdeas] = useState([])
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
        const _storyIdeas = await StoryIdeasHandler.fetchStoryIdeas({ profileId: currentProfileId })
        setStoryIdeas(_storyIdeas)
    }

    const handleOnSelect = (storyIdea: any) => {
        onSelect(storyIdea)
    }

    const handleStoryIdeasOnChange = (_storyIdeas: any) => {
        const updatedStoryIdeas = [...storyIdeas]
        _storyIdeas.forEach((_storyIdea: any) => {
            // @ts-ignore
            const isAlreadyInTheList = storyIdeas.find((storyIdea) => storyIdea?.id === _storyIdea?.id)

            if (isAlreadyInTheList) return
            // @ts-ignore
            updatedStoryIdeas.push((_storyIdea))
        })

        setStoryIdeas([...updatedStoryIdeas])
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
                <div className="mt-2">
                    <AIStoryIdeaList storyIdeas={storyIdeas} onSelect={handleOnSelect} />
                </div>
            ) : null}
            <AIStoryGeneratorDialog
            active={showAIStoryGeneratorDialog}
            onSelect={handleOnSelect}
            onChange={handleStoryIdeasOnChange}
            onClose={() => setShowAIStoryGeneratorDialog(false)} />
        </div>
    )
}
