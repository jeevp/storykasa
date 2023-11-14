import STKButton from "@/components/STKButton/STKButton";
import {FadersHorizontal} from "@phosphor-icons/react";
import StoryFiltersDialog from "@/composedComponents/StoryFilters/StoryFiltersDialog/StoryFiltersDialog";
import {useState} from "react";

interface StoryFiltersProps {
    onChange?: () => void
}

function StoryFilters({ onChange = () => ({}) }: StoryFiltersProps) {
    // States
    const [showFiltersDialog, setShowFiltersDialog] = useState(false)


    return (
        <div>
            <STKButton
            variant="outlined"
            startIcon={<FadersHorizontal />}
            height="56px"
            color="info"
            onClick={() => setShowFiltersDialog(!showFiltersDialog)}>
                Filters
            </STKButton>
            <StoryFiltersDialog
            active={showFiltersDialog}
            onClose={() => setShowFiltersDialog(false)}
            onChange={() => onChange()}/>
        </div>
    )
}


export default StoryFilters
