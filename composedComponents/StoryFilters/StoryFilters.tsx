import STKButton from "@/components/STKButton/STKButton";
import {FadersHorizontal} from "@phosphor-icons/react";
import StoryFiltersDialog from "@/composedComponents/StoryFilters/StoryFiltersDialog/StoryFiltersDialog";
import {useState} from "react";
import {useStory} from "@/contexts/story/StoryContext";
import useDevice from "@/customHooks/useDevice";

interface StoryFiltersProps {
    onChange?: () => void
}

function StoryFilters({ onChange = () => ({}) }: StoryFiltersProps) {
    // States
    const [showFiltersDialog, setShowFiltersDialog] = useState(false)

    // Contexts
    const { storyFilters } = useStory()

    // Hooks
    const { onMobile } = useDevice()

    const storyFilterItems = Object.keys(storyFilters).length


    return (
        <div>
            <STKButton
            variant="outlined"
            startIcon={<FadersHorizontal />}
            height="56px"
            fullWidth={onMobile}
            color="info"
            onClick={() => setShowFiltersDialog(!showFiltersDialog)}>
                Filters
                {storyFilterItems > 0 && (
                    <span className="ml-2 text-white rounded-full w-6 h-6 bg-neutral-500 flex justify-center items-center">
                        {storyFilterItems}
                    </span>
                )}
            </STKButton>
            <StoryFiltersDialog
            active={showFiltersDialog}
            onClose={() => setShowFiltersDialog(false)}
            onChange={() => onChange()}/>
        </div>
    )
}


export default StoryFilters
