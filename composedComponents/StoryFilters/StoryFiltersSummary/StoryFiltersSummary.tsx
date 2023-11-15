import {useStory} from "@/contexts/story/StoryContext";
import {Chip} from "@mui/material";
import {useEffect, useState} from "react";
import Story,{storyLengths} from "@/models/Story";
import {XCircle} from "@phosphor-icons/react";
import StoryHandler from "@/handlers/StoryHandler";

interface StoryFiltersSummaryProps {
    privateStories: boolean
}

export default function StoryFiltersSummary({ privateStories }: StoryFiltersSummaryProps) {
    // State
    const [filterChips, setFilterChips] = useState([])

    // Contexts
    const {
        storyFilters,
        setStoryFilters,
        setPrivateStories,
        setPublicStories
    } = useStory()

    // Watchers
    useEffect(() => {
        const storyFilterKeys = Object.keys(storyFilters)
        if (storyFilterKeys.length > 0) {
            // @ts-ignore
            setFilterChips(storyFilterKeys.map((filterKey: any) => {
                switch(true) {
                    case  filterKey === "narrator" || filterKey === "language":
                        return {
                            // @ts-ignore
                            label: storyFilters[filterKey],
                            value: filterKey
                        }

                    case filterKey === "ageGroups":

                        // @ts-ignore
                        const _story = new Story({
                            // @ts-ignore
                            ageGroups: storyFilters[filterKey]
                        })

                        return  {
                            label: _story.ageGroupsShortLabel,
                            value: filterKey
                        }

                    case filterKey === "storyLengths":
                        const label = storyLengths.filter((storyLength) => {
                            // @ts-ignore
                            return storyFilters[filterKey].includes(storyLength.value)
                        }).map((length) => length.name).join(" - ")


                        return {
                            label,
                            value: filterKey
                        }

                    default:
                        break
                }
            }))
        }
    }, [storyFilters]);

    // Methods
    const handleClearFilter = async (filterKey: string) => {
        const _filters = { ...storyFilters }
        // @ts-ignore
        delete _filters[filterKey]
        setStoryFilters(_filters)

        if (privateStories) {
            // @ts-ignore
            const publicStories = await StoryHandler.fetchStories({ ..._filters })
            setPrivateStories(publicStories)
        } else {
            // @ts-ignore
            const privateStories = await StoryHandler.fetchPublicStories({ ..._filters })
            setPublicStories(privateStories)
        }

        setStoryFilters(_filters)
    }

    return (
        <div className="flex items-center overflow-x-auto">
            {filterChips.map((filterChip, index) => (
                <div key={index} className="mr-1">
                    <Chip
                    // @ts-ignore
                    label={filterChip.label}
                    deleteIcon={<XCircle />}
                    // @ts-ignore
                    onDelete={() => handleClearFilter(filterChip.value)} />
                </div>
            ))}
        </div>
    )
}
