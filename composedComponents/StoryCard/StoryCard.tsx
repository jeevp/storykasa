import { format } from 'timeago.js'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { Baby, GlobeSimple, Timer } from '@phosphor-icons/react'
import { ageGroups, languages } from '../../app/enums'
import STKCard from "@/components/STKCard/STKCard";
import {Avatar} from "@mui/material";
import {green300, green600} from "@/assets/colorPallet/colors";
import STKAvatar from "@/components/STKAvatar/STKAvatar";

export default function StoryCard({
  story,
  selected,
}: {
    story: StoryWithProfile
    selected: boolean
}) {
    return (
        <STKCard>
            <div className="flex p-4">
                <div className="flex justify-items-start">
                    <STKAvatar src={story?.profiles?.avatar_url!} name={story?.profiles?.profile_name} />
                </div>
                <div className="w-full cursor-pointer ml-4">
                    <div className="flex items-center justify-between w-full">
                        {story?.profiles && (
                            <label>
                                {story?.profiles?.profile_name}
                            </label>
                        )}

                        <label className="text-xs">{format(story?.last_updated)}</label>
                    </div>

                    <label className="font-semibold text-lg">
                        {story?.title}
                    </label>

                    <div className="flex items-center opacity-60 mt-4">
                        {story?.duration && (
                            <div className="flex items-center">
                                <Timer size={14} weight="bold" />
                                <label className="ml-1">
                                    {Math.ceil(story?.duration / 60)} min
                                </label>
                            </div>
                        )}
                        {story?.age_group && (
                            <div className="flex items-center ml-4">
                                <Baby size={14} weight="bold" />
                                <label className="ml-1">
                                    {ageGroups.find((ag) => ag.name === story?.age_group!)?.code}
                                </label>
                            </div>
                        )}
                        {story?.language && (
                            <div className="flex items-center ml-4">
                                <GlobeSimple size={14} weight="bold" />
                                <label className="ml-1">
                                    {languages
                                        .find((l) => l.name === story?.language!)
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
