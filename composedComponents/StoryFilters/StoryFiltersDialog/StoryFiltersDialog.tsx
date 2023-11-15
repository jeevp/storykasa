import STKDialog from "@/components/STKDialog/STKDialog";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKButton from "@/components/STKButton/STKButton";
import {useEffect, useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import {useStory} from "@/contexts/story/StoryContext";
import {allowedAgeGroups, languages, storyLengths} from "@/models/Story";
import useDevice from "@/customHooks/useDevice";

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
        setStoryNarrators ,
        setStoryLanguages,
        setStoryFilters,
        storyLanguages,
        storyNarrators,
        storyFilters
    } = useStory()

    // Hooks
    const { onMobile } = useDevice()

    // Mounted
    useEffect(() => {
        setFilters({})
        handleFetchStoryFilters()
    }, []);

    // Watchers
    useEffect(() => {
        if (storyFilters) {
            setFilters({ ...storyFilters })
        }
    }, [storyFilters]);

    // Methods
    const handleFetchStoryFilters = async () => {
        const { narrators, languages } = await StoryHandler.fetchStoriesFilters({ privateStories })

        setStoryNarrators(narrators)
        setStoryLanguages(languages)
    }

    const handleFilterOnChange = (key: string, value: any) => {
        const _filters = { ...filters }
        if (!value || value?.length === 0) {
            // @ts-ignore
            delete _filters[key]
        } else {
            // @ts-ignore
            _filters[key] = value
        }

        setFilters({ ..._filters })
    }

    const handleApplyFilters = async (_filters: any) => {
        try {
            setLoading(true)
            if (privateStories) {
                const publicStories = await StoryHandler.fetchStories({ ..._filters })
                setPrivateStories(publicStories)
            } else {
                const privateStories = await StoryHandler.fetchPublicStories({ ..._filters })
                setPublicStories(privateStories)
            }

            onChange()
            setStoryFilters(_filters)
        } finally {
            setLoading(false)
            onClose()

        }
    }

    const handleClose = () => {
        removeFiltersNotApplied()
        onClose()
    }

    const removeFiltersNotApplied = () => {
        const appliedFilters = Object.keys(storyFilters)
        if (appliedFilters.length === 0) {
            setFilters({})
            return
        }

        Object.keys(filters).forEach((filter) => {
            if (!appliedFilters.includes(filter)) {
                setFilters({
                    ...filters,
                    [filter]: ""
                })
            }
        })
    }


    const handleClearFilters = async () => {
        setStoryFilters({})
        setFilters({})
        await handleApplyFilters({})
    }

    return (
        <STKDialog maxWidth="xs" active={active} fullScreen={onMobile} onClose={handleClose}>
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
                        value={storyNarrators.find((narrator) => narrator?.narratorName === filters?.narrator)}
                        options={storyNarrators}
                        onChange={(narrator: any) => handleFilterOnChange("narrator", narrator?.narratorName)}/>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="font-semibold">Language</label>
                    <div className="mt-2">
                        <STKAutocomplete
                        placeholder="Filter by language"
                        options={storyLanguages}
                        optionLabel="language"
                        // @ts-ignore
                        value={storyLanguages.find((language) => language?.language === filters?.language)}
                        fluid
                        onChange={(language: any) => handleFilterOnChange("language", language?.language)}/>
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
                    <div className={Object.keys(storyFilters).length === 0 ? 'disabled' : ''}>
                        <STKButton variant="outlined" onClick={handleClearFilters}>Clear filters</STKButton>
                    </div>
                    <div className="ml-2">
                        <STKButton
                        onClick={() => handleApplyFilters(filters)}
                        loading={loading}>
                            Apply filters
                        </STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
