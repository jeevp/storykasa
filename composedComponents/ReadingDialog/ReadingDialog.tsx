import React, { useEffect, useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import StoryHandler from "@/handlers/StoryHandler";
import Story from "@/models/Story";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton"
interface ReadingDialogProps {
  open: boolean;
  story: Story | null;
  onClose?: () => void;
}

export default function ReadingDialog({
  open,
  onClose = () => ({}),
  story,
}: ReadingDialogProps) {
  const { onMobile } = useDevice();
  // States
  const [loading, setLoading] = useState(true)

  // Contexts
  const [startIllustrationsDisplay, setStartIllustrationsDisplay] = useState(false);
  const [storyHasEnded, setStoryHasEnded] = useState(false);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [transcription, setTranscription] = useState("")
  const [readerCurrentTime, setReaderCurrentTime] = useState<number>(0);
  const [playCounted, setPlayCounted] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcriptWithTimestamps, setTranscriptWithTimestamps] = useState<
    { word: string; startTime: string; endTime: string }[]
  >([]);


  useEffect(() => {
    if (story?.recordingUrl) {
      const audio = new Audio(story?.recordingUrl);

      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
      });

      return () => {
        audio.removeEventListener("loadedmetadata", () => {
          setAudioDuration(audio.duration);
        });
      };
    }
  }, [story?.recordingUrl]);

  useEffect(() => {
    if (audioDuration) {
      handlTranscriptWithTimestamp()
    }
  }, [audioDuration]);

  const handlTranscriptWithTimestamp = async () => {
    setLoading(true)
    const transcription = await StoryHandler.getStoryTranscript(story?.storyId)
    const words = transcription.split(" ");
    const numWords = words.length;
    const avgWordDuration = audioDuration / numWords;
    const transcriptWithTimestamps = words.map((word, index) => {
      const startTime = index * avgWordDuration;
      const endTime = startTime + avgWordDuration;
      return {
        word,
        endTime: endTime.toFixed(2),
        startTime: startTime.toFixed(2),
      };
    });
    setTranscriptWithTimestamps(transcriptWithTimestamps);
    setLoading(false)

  }

  const handleStoryOnEnd = () => {
    setStoryHasEnded(true);
    setStartIllustrationsDisplay(false);
    setStoryCurrentTime(0);
  };

  const handlePlaying = async (playing: boolean) => {
    if (playing) {
      setStoryHasEnded(false);
      if (!playCounted) {
        await StoryHandler.updatePlayCount({ storyId: story?.storyId || "" });
        setPlayCounted(true);
      }
    }
    setStartIllustrationsDisplay(playing);
  };

  const handleOnTimeChange = (time: any) => {
    setStoryCurrentTime(time);
  };

  const handleCurrentTime = (currentTime: string) => {
    const timeParts = currentTime.split(":");
    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseInt(timeParts[1], 10);
    const totalSeconds = minutes * 60 + seconds;

    setReaderCurrentTime(totalSeconds);
  };

  const renderTranscript = () => {
    let renderedText = "";

    transcriptWithTimestamps.forEach(({ word, startTime, endTime }) => {
      const start = parseFloat(startTime);
      const end = parseFloat(endTime);

      if (end <= readerCurrentTime) {
        renderedText += `<span style="color: #333333;">${word}</span> `;
      } else {
        renderedText += `<span style="color: #888888;">${word}</span> `;
      }
    });
    return { __html: renderedText };
  };

  return (
    <STKDialog
      active={open}
      maxWidth="sm"
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      <form>
        <div className="mt-6 ">
          <STKAudioPlayer
            readingDialog
            onTimeChanging={handleCurrentTime}
            outlined
            src={story?.recordingUrl || ""}
            html5
            onEnd={handleStoryOnEnd}
            customDuration={story?.duration}
            // @ts-ignore
            onPlaying={handlePlaying}
            // @ts-ignore
            onTimeChange={handleOnTimeChange}
          />
        </div>
        <div className="mt-6">
          {loading ? (
              <div>
                <div>
                  <STKSkeleton width="100%" height="30px" />
                </div>
                <div className="mt-2">
                  <STKSkeleton width="100%" height="30px" />
                </div>
                <div className="mt-2">
                  <STKSkeleton width="100%" height="30px" />
                </div>
                <div className="mt-2">
                  <STKSkeleton width="100%" height="30px" />
                </div>
              </div>
          ) : (
              <p className="text-lg leading-8" dangerouslySetInnerHTML={renderTranscript()} />
          )}
        </div>
      </form>
    </STKDialog>
  );
}
