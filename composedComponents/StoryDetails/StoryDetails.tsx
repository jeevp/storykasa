import {useContext, useState} from 'react'
import { useRouter } from 'next/navigation'
import { Baby, GlobeSimple, Trash, Pencil } from '@phosphor-icons/react'
import ProfileContext from '@/contexts/ProfileContext'
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import DeleteStoryDialog from "@/composedComponents/DeleteStoryDialog/DeleteStoryDialog";
import STKButton from "@/components/STKButton/STKButton";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKSlide from "@/components/STKSlide/STKSlide";
import UpdateStoryDialog from "@/composedComponents/UpdateStoryDialog/UpdateStoryDialog";
import Story from "@/models/Story";

interface StoryDetailsProps {
    story: Story | null;
    editionNotAllowed?: boolean;
    onLoadStories?: () => void;
}
export default function StoryDetails({
    story,
    editionNotAllowed,
    onLoadStories = () => ({})
}: StoryDetailsProps) {
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
                        src={story?.profileAvatar}
                        name={story?.profileName}
                    />
                    <label className="ml-2 font-semibold text-base">{story?.profileName}</label>
                </div>
                <div className="flex flex-col mt-4">
                    {story?.ageGroups && (
                        <div className="flex items-start">
                            <Baby size={20} />
                            <label className="ml-2">
                                {story?.ageGroupsLabel}
                            </label>
                        </div>
                    )}
                    {story?.language && (
                        <div className="flex items-center mt-2">
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
                        <div key={story?.recordingUrl} className="mt-2">
                            <STKAudioPlayer
                                outlined
                                // @ts-ignore
                                src={story?.recordingUrl}
                                onEnd={handleStoryOnEnd}
                                // @ts-ignore
                                onPlaying={handlePlaying} />
                        </div>
                    </div>
                ) : (
                    <>
                        {story?.recordingUrl && (
                            <div key={story?.recordingUrl} className="mt-6">
                                <STKAudioPlayer
                                    outlined src={story?.recordingUrl}
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
                {currentProfileId === story?.profileId && !editionNotAllowed ? (
                    <div className="flex items-center">
                        <div className="mr-2">
                            <STKButton startIcon={<Pencil size={18} />} onClick={() => setShowUpdateStoryDialog(true)}>
                                Edit story
                            </STKButton>
                        </div>
                        <div>
                            <STKButton variant="outlined" startIcon={<Trash size={18} />} onClick={() => setShowDeleteStoryDialog(true)}>
                                Delete story
                            </STKButton>
                        </div>
                    </div>
                ) : null}
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
