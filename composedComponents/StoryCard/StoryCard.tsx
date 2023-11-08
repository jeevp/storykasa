import { format } from 'timeago.js'
import { Baby, GlobeSimple, Timer } from '@phosphor-icons/react'
import Story, { languages } from '@/models/Story'
import STKCard from "@/components/STKCard/STKCard";
import STKAvatar from "@/components/STKAvatar/STKAvatar";

export default function StoryCard({ story }: {
    story: Story
    selected: boolean
}) {

    return (
        <STKCard>
            <div className="p-4">
                <div className="flex">
                    <div className="flex justify-items-start">
                        <STKAvatar src={story?.profileAvatar!} name={story?.profileName} />
                    </div>
                    <div className="w-full cursor-pointer ml-4">
                        <div className="flex items-center justify-between w-full">
                            {story?.profileName && (
                                <label>
                                    {story?.profileName}
                                </label>
                            )}

                            <label className="text-xs">{format(story?.lastUpdated)}</label>
                        </div>

                        <label className="font-semibold text-lg">
                            {story?.title}
                        </label>

                        <div className="lg:flex hidden items-center flex-wrap opacity-60 mt-4 pr-14">
                            {story?.duration && (
                                <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                    <Timer size={14} weight="bold" />
                                    <label className="ml-1">
                                        {Math.ceil(story?.duration / 60)} min
                                    </label>
                                </div>
                            )}
                            {story?.ageGroups && (
                                <div className="flex items-center mr-4 mb-1 lg:mb-0">
                                    <Baby size={14} weight="bold" />
                                    <label className="ml-1">
                                        {story?.ageGroupsShortLabel}
                                    </label>
                                </div>
                            )}
                            {story?.language && (
                                <div className="flex items-center">
                                    <GlobeSimple size={14} weight="bold" />
                                    <label className="ml-1">
                                        {story?.language}
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex lg:hidden items-center flex-wrap opacity-60 mt-4 pr-14">
                    {story?.duration && (
                        <div className="flex items-center mr-4 mb-1 lg:mb-0">
                            <Timer size={14} weight="bold" />
                            <label className="ml-1">
                                {Math.ceil(story?.duration / 60)} min
                            </label>
                        </div>
                    )}
                    {story?.ageGroups && (
                        <div className="flex items-center mr-4 mb-1 lg:mb-0">
                            <Baby size={14} weight="bold" />
                            <label className="ml-1">
                                {story?.ageGroupsShortLabel}
                            </label>
                        </div>
                    )}
                    {story?.language && (
                        <div className="flex items-center">
                            <GlobeSimple size={14} weight="bold" />
                            <label className="ml-1">
                                {story?.language}
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </STKCard>
    )
}
