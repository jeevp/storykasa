import React, { useEffect, useState } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import StoryHandler from "@/handlers/StoryHandler";
import Story from "@/models/Story";

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

  // Contexts

  const [startIllustrationsDisplay, setStartIllustrationsDisplay] = useState(false);
  const [storyHasEnded, setStoryHasEnded] = useState(false);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [readerCurrentTime, setReaderCurrentTime] = useState<number>(0);
  const [playCounted, setPlayCounted] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcriptWithTimestamps, setTranscriptWithTimestamps] = useState<
    { word: string; startTime: string; endTime: string }[]
  >([]);


  useEffect(() => {
    const audio = new Audio(story?.recordingUrl);

    audio.addEventListener("loadedmetadata", () => {
      setAudioDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration);
      });
    };
  }, [story?.recordingUrl]);

  useEffect(() => {
    const transcription =
      "Once upon a time, in a faraway land, there lived a brave knight named Sir Gallant. He was known for his courage and kindness, and the people loved him dearly. One day, a dragon appeared in the kingdom, causing fear and chaos. Sir Gallant knew he had to act. With his sword in hand, he set out to face the beast. The journey was long and arduous, but Sir Gallant did not waver. He crossed treacherous mountains and dark forests, always moving forward. Finally, he reached the dragon's lair. The dragon was fierce and powerful, but Sir Gallant fought bravely. After a long and intense battle, he managed to defeat the dragon. The kingdom rejoiced at the news of Sir Gallant's victory. He returned home a hero, celebrated by all. From that day on, Sir Gallant's name was etched in the annals of history as a symbol of bravery and heroism. And so, the brave knight lived happily ever after, always ready to defend his kingdom from any threat that might arise.";
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
  }, [audioDuration]);
  console.log({ transcriptWithTimestamps });


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
  console.log(readerCurrentTime);

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
          <p dangerouslySetInnerHTML={renderTranscript()} />
        </div>
      </form>
    </STKDialog>
  );
}
