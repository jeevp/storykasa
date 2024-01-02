import {useStory} from "@/contexts/story/StoryContext";
import {Chip} from "@mui/material";
import {useEffect, useState} from "react";
import Story,{storyLengths} from "@/models/Story";
import {XCircle} from "@phosphor-icons/react";
import StoryHandler from "@/handlers/StoryHandler";
import {useProfile} from "@/contexts/profile/ProfileContext";
import STKChip from "@/components/STKChip/STKChip";

interface StoryFiltersSummaryProps {
    privateStories?: boolean
    onChange?: () => void
}

export default function StoryFiltersSummary({ privateStories, onChange = () => ({}) }: StoryFiltersSummaryProps) {
    // State
    const [filterChips, setFilterChips] = useState([])

    // Contexts
    const {
        storyFilters,
        setStoryFilters,
        setPrivateStories,
        setPublicStories
    } = useStory()

    const { currentProfileId } = useProfile()

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
            const publicStories = await StoryHandler.fetchPrivateStories({ ..._filters }, {
                profileId: currentProfileId
            })
            setPrivateStories(publicStories)
        } else {
            // @ts-ignore
            const privateStories = await StoryHandler.fetchPublicStories({ ..._filters })
            setPublicStories(privateStories)
        }

        setStoryFilters(_filters)
        onChange()
    }

    return (
        <div className="flex items-center overflow-x-auto hide-scrollbar">
            {filterChips.map((filterChip, index) => (
                <div key={index} className="mr-1">
                    <STKChip
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
