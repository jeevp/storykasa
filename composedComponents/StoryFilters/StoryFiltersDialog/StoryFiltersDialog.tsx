import STKDialog from "@/components/STKDialog/STKDialog";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKButton from "@/components/STKButton/STKButton";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import {useStory} from "@/contexts/story/StoryContext";
import {allowedAgeGroups, languages, storyLengths} from "@/models/Story";

interface StoryFiltersDialogProps {
    active?: boolean,
    onClose?: () => void,
    onChange?: () => void,
    privateStories?: boolean
}

export default function StoryFiltersDialog({
    active = false,
    onClose = () => ({}),
    onChange = () => ({}),
    privateStories = false
}: StoryFiltersDialogProps) {
    // States
    const [filters, setFilters] = useState({})
    const [loading, setLoading] = useState(false)

    // Context
    const {
        setPrivateStories,
        setPublicStories,
        setPrivateStoryNarrators ,
        setPublicStoryNarrators,
        publicStoryNarrators,
        setStoryFilters,
        storyFilters
    } = useStory()

    // Mounted
    useEffect(() => {
        handleFetchStoriesNarrators()
    }, []);

    // Watchers
    useEffect(() => {
        if (storyFilters) {
            setFilters({ ...storyFilters })
        }
    }, [storyFilters]);

    // Methods
    const handleFetchStoriesNarrators = async () => {
        const storyNarrators = await StoryHandler.fetchStoriesNarrators({ privateStories })
        if (privateStories) {
            setPrivateStoryNarrators(storyNarrators)
        } else {
            setPublicStoryNarrators(storyNarrators)
        }
    }

    const handleFilterOnChange = (key: string, value: any) => {
        setFilters({
            ...filters,
            [key]: value
        })
    }

    const handleApplyFilters = async () => {
        try {
            setLoading(true)
            if (privateStories) {
                const publicStories = await StoryHandler.fetchStories({ ...filters })
                setPrivateStories(publicStories)
            } else {
                const privateStories = await StoryHandler.fetchPublicStories({ ...filters })
                setPublicStories(privateStories)
            }

            onChange()
            setStoryFilters(filters)
        } finally {
            setLoading(false)
            onClose()

        }
    }


    return (
        <STKDialog maxWidth="xs" active={active} onClose={() => onClose()}>
            <h2 className="">Filters</h2>
            <div className="mt-4">
                <div>
                    <label className="font-semibold">Narrator</label>
                    <div className="mt-2">
                        <STKAutocomplete
                        optionLabel="narratorName"
                        placeholder="Filter by narrator"
                        fluid
                        // @ts-ignore
                        value={publicStoryNarrators.find((narrator) => narrator?.narratorName === filters?.narrator)}
                        options={publicStoryNarrators}
                        onChange={(narrator: any) => handleFilterOnChange("narrator", narrator?.narratorName)}/>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Language</label>
                    <div className="mt-2">
                        <STKAutocomplete
                        placeholder="Filter by language"
                        options={languages}
                        optionLabel="name"
                        // @ts-ignore
                        value={languages.find((language) => language?.name === filters?.language)}
                        fluid
                        onChange={(language: any) => handleFilterOnChange("language", language?.name)}/>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Age</label>
                    <div className="mt-2">
                        <STKSelect
                        fluid
                        placeholder="Filter by ages"
                        options={allowedAgeGroups}
                        // @ts-ignore
                        value={allowedAgeGroups.filter((ageGroup) => filters?.ageGroups?.includes(ageGroup.value))}
                        optionLabel="name"
                        multiple
                        onChange={(ages: any) => handleFilterOnChange("ageGroups", ages)}/>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Story length</label>
                    <div className="mt-2">
                        <STKSelect
                        fluid
                        placeholder="Filter by story length"
                        options={storyLengths}
                            // @ts-ignore
                        value={storyLengths.filter((storyLength) => filters?.storyLengths?.includes(storyLength?.value))}
                        optionLabel="name"
                        multiple
                        onChange={(storyLengths: any) => handleFilterOnChange("storyLengths", storyLengths)}/>
                    </div>
                </div>
                <div className="flex items-center justify-end mt-10">
                    <div>
                        <STKButton variant="outlined" onClick={() => onClose()}>Cancel</STKButton>
                    </div>
                    <div className="ml-2">
                        <STKButton
                        onClick={handleApplyFilters}
                        loading={loading}>
                            Apply filters
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
