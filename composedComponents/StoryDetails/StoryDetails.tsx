import { Avatar } from "@mui/material"
import {useContext, useState} from 'react'
import { useRouter } from 'next/navigation'
import { Baby, GlobeSimple, Trash } from '@phosphor-icons/react'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { ProfileContext } from '../ProfileProvider/ProfileProvider'
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import DeleteStoryDialog from "@/composedComponents/DeleteStoryDialog/DeleteStoryDialog";
import STKButton from "@/components/STKButton/STKButton";

interface StoryDetailsProps {
    story: StoryWithProfile | null
}
export default function StoryDetails({ story }: StoryDetailsProps) {
    const router = useRouter()

    // States
    const [showDeleteStoryDialog, setShowDeleteStoryDialog] = useState(false)

    const { currentProfileID } = useContext(ProfileContext) as any

    return (
        <div>
            <div>
                <h1 className="max-w-[12em] text-2xl font-semibold">{story?.title}</h1>
                <div className="mt-4 flex items-center">
                    <Avatar
                        src={story?.profiles?.avatar_url!}
                    ></Avatar>
                    <label className="ml-2 font-semibold text-base">{story?.profiles.profile_name}</label>
                </div>
                <div className="flex flex-col mt-4">
                    {story?.age_group && (
                        <div className="flex items-center">
                            <Baby size={20} />
                            <label className="ml-2">
                                {story.age_group}
                            </label>
                        </div>
                    )}
                    {story?.language && (
                        <div className="flex items-center mt-1">
                            <GlobeSimple size={20} />
                            <label className="ml-2">
                                {story.age_group}
                            </label>
                        </div>
                    )}
                </div>
                {story?.recording_url && (
                    <div key={story.recording_url} className="mt-6">
                        <STKAudioPlayer outlined src={story.recording_url} />
                    </div>
                )}
                <div className="mb-8 mt-6">
                    <div className="mt-4">
                        <div className="overflow-y-scroll">
                            {story?.description}
                        </div>
                    </div>
                </div>
                {currentProfileID === story?.profiles.profile_id && (
                    <div>
                        <STKButton startIcon={<Trash size={18} />} onClick={() => setShowDeleteStoryDialog(true)}>
                            Delete story
                        </STKButton>
                        <DeleteStoryDialog
                        open={showDeleteStoryDialog}
                        story={story}
                        onClose={() => setShowDeleteStoryDialog(false)} />
                    </div>
                )}
            </div>
        </div>
    )
}
