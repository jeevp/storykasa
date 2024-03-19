import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import AIStoryGeneratorDialog from "@/composedComponents/AIStoryGenerator/AIStoryGeneratorDialog";
import {useState} from "react";

export default function AIStoryGenerator() {
    // States
    const [
        showAIStoryGeneratorDialog,
        setShowAIStoryGeneratorDialog
    ] = useState(false)


    return (
        <div>
            <STKCard>
                <div className="p-4 flex justify-between items-center">
                    <label>Need some help getting started? Generate a story idea and then finish it yourself!</label>
                    <STKButton color="aiMode" onClick={() => setShowAIStoryGeneratorDialog(true)}>Try our AI idea generator</STKButton>
                </div>
            </STKCard>
            <AIStoryGeneratorDialog
            active={showAIStoryGeneratorDialog}
            onClose={() => setShowAIStoryGeneratorDialog(false)} />
        </div>
    )
}
