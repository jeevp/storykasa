import { Avatar } from "@mui/material"
import {useContext, useState} from 'react'
import { useRouter } from 'next/navigation'
import { Baby, GlobeSimple, Trash, Pencil } from '@phosphor-icons/react'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import ProfileContext from '@/contexts/ProfileContext'
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import DeleteStoryDialog from "@/composedComponents/DeleteStoryDialog/DeleteStoryDialog";
import STKButton from "@/components/STKButton/STKButton";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKSlide from "@/components/STKSlide/STKSlide";
import UpdateStoryDialog from "@/composedComponents/UpdateStoryDialog/UpdateStoryDialog";

interface StoryDetailsProps {
    story: StoryWithProfile | null;
    onLoadStories?: () => void;
}
export default function StoryDetails({ story, onLoadStories = () => ({}) }: StoryDetailsProps) {
    const router = useRouter()

    // States
    const [showUpdateStoryDialog, setShowUpdateStoryDialog] = useState(false)
    const [showDeleteStoryDialog, setShowDeleteStoryDialog] = useState(false)
    const [startIllustrationsDisplay, setStartIllustrationsDisplay] = useState(false)
    const [storyHasEnded, setStoryHasEnded] = useState(false)

    const { currentProfileId } = useContext(ProfileContext) as any

    const handleStoryOnEnd = () => {
        setStoryHasEnded(true)

        setTimeout(() => {
            setStartIllustrationsDisplay(false)
        }, 1000)
    }

    const handlePlaying = (playing: boolean) => {
        if (playing) setStoryHasEnded(false)
        setStartIllustrationsDisplay(playing)
    }


    return (
        <div>
            <div>
                <h1 className="m-0 max-w-[12em] text-2xl font-semibold">{story?.title}</h1>
                <div className="mt-4 flex items-center">
                    <STKAvatar
                        src={story?.profiles?.avatar_url!}
                        name={story?.profiles?.profile_name}
                    />
                    <label className="ml-2 font-semibold text-base">{story?.profiles?.profile_name}</label>
                </div>
                <div className="flex flex-col mt-4">
                    {story?.age_group && (
                        <div className="flex items-center">
                            <Baby size={20} />
                            <label className="ml-2">
                                {story?.age_group}
                            </label>
                        </div>
                    )}
                    {story?.language && (
                        <div className="flex items-center mt-1">
                            <GlobeSimple size={20} />
                            <label className="ml-2">
                                {story?.language}
                            </label>
                        </div>
                    )}
                </div>

                {
                    // @ts-ignore
                    story?.illustrationsURL?.length > 0 ? (
                    <div className="mt-6">
                        <STKSlide
                        // @ts-ignore
                        images={story?.illustrationsURL}
                        isRunning={startIllustrationsDisplay}
                            // @ts-ignore
                        duration={story?.duration}
                        restart={storyHasEnded && startIllustrationsDisplay}/>
                        <div key={story?.recording_url} className="mt-2">
                            <STKAudioPlayer
                                outlined
                                // @ts-ignore
                                src={story?.recording_url}
                                onEnd={handleStoryOnEnd}
                                // @ts-ignore
                                onPlaying={handlePlaying} />
                        </div>
                    </div>
                ) : (
                    <>
                        {story?.recording_url && (
                            <div key={story?.recording_url} className="mt-6">
                                <STKAudioPlayer
                                    outlined src={story?.recording_url}
                                    onEnd={handleStoryOnEnd}
                                    // @ts-ignore
                                    onPlaying={handlePlaying} />
                            </div>
                        )}
                    </>
                )}
                <div className="mb-8 mt-6">
                    <div className="mt-4">
                        <div className="overflow-y-scroll">
                            {story?.description}
                        </div>
                    </div>
                </div>
                {currentProfileId === story?.profiles?.profile_id && (
                    <div className="flex items-center">
                        <div>
                            <STKButton startIcon={<Pencil size={18} />} onClick={() => setShowUpdateStoryDialog(true)}>
                                Edit story
                            </STKButton>
                        </div>
                        <div className="ml-2">
                            <STKButton variant="outlined" startIcon={<Trash size={18} />} onClick={() => setShowDeleteStoryDialog(true)}>
                                Delete story
                            </STKButton>
                        </div>
                    </div>
                )}
            </div>
            <UpdateStoryDialog
            open={showUpdateStoryDialog}
            story={story}
            onSuccess={() => onLoadStories()}
            onClose={() => setShowUpdateStoryDialog(false)} />
            <DeleteStoryDialog
            open={showDeleteStoryDialog}
            story={story}
            onSuccess={() => onLoadStories()}
            onClose={() => setShowDeleteStoryDialog(false)} />
        </div>
    )
}
