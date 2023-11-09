import STKDialog from "@/components/STKDialog/STKDialog";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKButton from "@/components/STKButton/STKButton";

interface StoryFiltersDialogProps {
    active?: boolean,
    onClose?: () => void
}

export default function StoryFiltersDialog({
    active = false,
    onClose = () => ({})
}: StoryFiltersDialogProps) {
    return (
        <STKDialog maxWidth="xs" active={active} onClose={() => onClose()}>
            <h2 className="">Filters</h2>
            <div className="mt-4">
                <div>
                    <label className="font-semibold">Narrator</label>
                    <div className="mt-2">
                        <STKAutocomplete fluid  />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Language</label>
                    <div className="mt-2">
                        <STKSelect fluid  />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Age</label>
                    <div className="mt-2">
                        <STKSelect fluid  />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Story length</label>
                    <div className="mt-2">
                        <STKSelect fluid  />
                    </div>
                </div>
                <div className="flex items-center justify-end mt-10">
                    <div>
                        <STKButton variant="outlined">Cancel</STKButton>
                    </div>
                    <div className="ml-2">
                        <STKButton>Cancel</STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
