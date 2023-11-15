import {useStory} from "@/contexts/story/StoryContext";
import {Chip} from "@mui/material";
import {useEffect, useState} from "react";
import Story, {allowedAgeGroups} from "@/models/Story";

export default function StoryFiltersSummary() {
    // State
    const [filterChips, setFilterChips] = useState([])

    // Contexts
    const { storyFilters } = useStory()

    // Watchers
    useEffect(() => {
        const storyFilterKeys = Object.keys(storyFilters)
        if (storyFilterKeys.length > 0) {
            // @ts-ignore
            console.log({ storyFilterKeys })
            setFilterChips(storyFilterKeys.map((filterKey: any) => {
                switch(true) {
                    case  filterKey === "narrator" || filterKey === "language":
                        return storyFilters[filterKey]

                    case filterKey === "ageGroups":
                        const _story = new Story({
                            ageGroups: storyFilters[filterKey]
                        })

                        return _story.ageGroupsShortLabel

                    case filterKey === "storyLengths":
                        return "Short"

                    default:
                        return ""
                }
            }))
        }
    }, [storyFilters]);

    return (
        <div className="flex items-center">
            {filterChips.map((filterChip) => (
                <div className="mr-1">
                    <Chip label={filterChip} />
                </div>
            ))}
        </div>
    )
}
