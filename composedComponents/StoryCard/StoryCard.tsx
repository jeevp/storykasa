import { format } from 'timeago.js'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { Baby, GlobeSimple, Timer } from '@phosphor-icons/react'
import { ageGroups, languages } from '../../app/enums'
import STKCard from "@/components/STKCard/STKCard";
import {Avatar} from "@mui/material";

export default function StoryCard({
  story,
  selected,
}: {
    story: StoryWithProfile
    selected: boolean
}) {
    return (
        <STKCard>
            <div className="flex items-center">
                <Avatar src={story.profiles?.avatar_url!}/>
                <div className="w-full cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                        {story.profiles && (
                            <label>
                                {story.profiles.profile_name}
                            </label>
                        )}

                        <label>{format(story.last_updated)}</label>
                    </div>

                    <label>
                        {story.title}
                    </label>

                    <div className="flex items-center opacity-60">
                        {story.duration && (
                            <div className="flex items-center">
                                <Timer size={14} weight="bold" />
                                <label>
                                    {Math.ceil(story.duration / 60)} min
                                </label>
                            </div>
                        )}
                        {story.age_group && (
                            <div className="flex items-center">
                                <Baby size={14} weight="bold" />
                                <label>
                                    {ageGroups.find((ag) => ag.name === story.age_group!)?.code}
                                </label>
                            </div>
                        )}
                        {story.language && (
                            <div className="flex items-center">
                                <GlobeSimple size={14} weight="bold" />
                                <label>
                                    {languages
                                        .find((l) => l.name === story.language!)
                                        ?.code.toLocaleUpperCase()}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </STKCard>
    )
}
