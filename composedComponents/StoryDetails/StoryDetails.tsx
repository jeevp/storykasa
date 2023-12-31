import {useState} from 'react'
import { Baby, GlobeSimple, Trash, Pencil } from '@phosphor-icons/react'
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import STKButton from "@/components/STKButton/STKButton";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKSlide from "@/components/STKSlide/STKSlide";
import Story from "@/models/Story";
import {useProfile} from "@/contexts/profile/ProfileContext";
import ReactMarkdown from 'react-markdown';

interface StoryDetailsProps {
    story: Story | null;
    editionNotAllowed?: boolean;
}
export default function StoryDetails({
    story,
    editionNotAllowed,
}: StoryDetailsProps) {
    // States
    const [startIllustrationsDisplay, setStartIllustrationsDisplay] = useState(false)
    const [storyHasEnded, setStoryHasEnded] = useState(false)
    const [storyCurrentTime, setStoryCurrentTime] = useState(0)

    const { currentProfileId } = useProfile()

    const handleStoryOnEnd = () => {
        setStoryHasEnded(true)
        setStartIllustrationsDisplay(false)
        setStoryCurrentTime(0)
    }

    const handlePlaying = (playing: boolean) => {
        if (playing) setStoryHasEnded(false)
        setStartIllustrationsDisplay(playing)
    }

    const handleOnTimeChange = (time: any) => {
        setStoryCurrentTime(time)
    }


    return (
        <div>
            <div>
                <h1 className="m-0 max-w-[12em] text-2xl font-semibold">{story?.title}</h1>
                <div className="mt-4 flex items-center">
                    <STKAvatar
                        src={story?.narratorName ? '' : story?.profileAvatar}
                        name={story?.narratorName || story?.profileName}
                    />
                    <label className="ml-2 font-semibold text-base">{story?.narratorName || story?.profileName}</label>
                </div>
                <div className="flex flex-col mt-4">
                    {story?.ageGroups && (
                        <div className="flex items-start">
                            <Baby size={20} />
                            <label className="ml-2">
                                {story?.ageGroupsLabel || story?.ageGroupsShortLabel}
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
                        targetDuration={storyCurrentTime}
                        restart={storyHasEnded && startIllustrationsDisplay}/>
                        <div key={story?.recordingUrl} className="mt-2">
                            <STKAudioPlayer
                                outlined
                                html5
                                // @ts-ignore
                                src={story?.recordingUrl}
                                onEnd={handleStoryOnEnd}
                                // @ts-ignore
                                onTimeChange={handleOnTimeChange}
                                onPlaying={handlePlaying} />
                        </div>
                    </div>
                ) : (
                    <>
                        {story?.recordingUrl && (
                            <div key={story?.recordingUrl} className="mt-6">
                                <STKAudioPlayer
                                    outlined src={story?.recordingUrl}
                                    html5
                                    onEnd={handleStoryOnEnd}
                                    // @ts-ignore
                                    onPlaying={handlePlaying}
                                    // @ts-ignore
                                    onTimeChange={handleOnTimeChange}/>
                            </div>
                        )}
                    </>
                )}
                <div className="mb-8 mt-6">
                    <div className="mt-4">
                        <div className="overflow-y-scroll whitespace-pre-line">
                            <ReactMarkdown>
                                {story?.description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
