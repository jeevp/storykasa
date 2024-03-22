import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import AIStoryGeneratorDialog from "@/composedComponents/AIStoryGenerator/AIStoryGeneratorDialog";
import {useState} from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useDevice from "@/customHooks/useDevice";

export default function AIStoryGenerator({ onSelect = () => ({}) }: { onSelect: (storyIdea: any) => void }) {
    const { onMobile } = useDevice()

    // States
    const [
        showAIStoryGeneratorDialog,
        setShowAIStoryGeneratorDialog
    ] = useState(false)

    const handleOnSelect = (storyIdea: any) => {
        onSelect(storyIdea)
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
            <AIStoryGeneratorDialog
            active={showAIStoryGeneratorDialog}
            onSelect={handleOnSelect}
            onClose={() => setShowAIStoryGeneratorDialog(false)} />
        </div>
    )
}
