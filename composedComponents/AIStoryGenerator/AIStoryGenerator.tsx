import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import AIStoryGeneratorDialog from "@/composedComponents/AIStoryGenerator/AIStoryGeneratorDialog";
import {useState} from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useDevice from "@/customHooks/useDevice";
import AIStoryIdeaList from "@/composedComponents/AIStoryGenerator/AIStoryIdeaList";

export default function AIStoryGenerator({ onSelect = () => ({}) }: { onSelect: (storyIdea: any) => void }) {
    const { onMobile } = useDevice()

    // States
    const [storyIdeas, setStoryIdeas] = useState([])
    const [
        showAIStoryGeneratorDialog,
        setShowAIStoryGeneratorDialog
    ] = useState(false)

    const handleOnSelect = (storyIdea: any) => {
        console.log({ storyIdea })
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
