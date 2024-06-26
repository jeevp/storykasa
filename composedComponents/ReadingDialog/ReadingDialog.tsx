import React, { useEffect, useState, useRef } from "react";
import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import StoryHandler from "@/handlers/StoryHandler";
import Story from "@/models/Story";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import STKButton from "@/components/STKButton/STKButton";
import {useAuth} from "@/contexts/auth/AuthContext";
import {useRouter} from "next/router";

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
  // Hooks
  const router = useRouter()
  const { onMobile } = useDevice();

  // Refs
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Contexts
  const { currentSubscription } = useSubscription();
  const { currentUserIsAdmin } = useAuth();

  // States
  const [loading, setLoading] = useState(true);
  const [startIllustrationsDisplay, setStartIllustrationsDisplay] = useState(false);
  const [storyHasEnded, setStoryHasEnded] = useState(false);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [readerCurrentTime, setReaderCurrentTime] = useState<number>(0);
  const [playCounted, setPlayCounted] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [transcriptWithTimestamps, setTranscriptWithTimestamps] = useState<
    { text: string; start: number; end: number }[]
  >([]);

  useEffect(() => {
    if (story?.recordingUrl) {
      const audio = new Audio(story.recordingUrl);

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
    if (audioDuration && story?.storyId) {
      handleTranscriptWithTimestamp();
    }
  }, [audioDuration, story?.storyId]);

  const handleTranscriptWithTimestamp = async () => {
    setLoading(true);
    if (story?.storyId) {
      const transcription = await StoryHandler.getStoryTranscript(story.storyId);
      setTranscriptWithTimestamps(transcription || []);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    if (transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector(".active");
      if (activeElement) {
        transcriptRef.current.scrollTo({
          // @ts-ignore
          top: activeElement.offsetTop - transcriptRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [readerCurrentTime]);

  const renderTranscript = () => {
    let renderedText = "";

    if (Array.isArray(transcriptWithTimestamps)) {
      transcriptWithTimestamps.forEach(({ text, start, end }) => {
        if (end <= readerCurrentTime) {
          renderedText += `<span style="color: #333333;">${text}</span> `;
        } else if (start <= readerCurrentTime && end > readerCurrentTime) {
          renderedText += `<span style="color: #3d996d;" class="active">${text}</span> `;
        } else {
          renderedText += `<span style="color: #888888;">${text}</span> `;
        }
      });
    }

    return { __html: renderedText };
  };

  const redirectToAccountSettings = async () => {
    await router.push("/account-settings")
  }

  return (
    <STKDialog
      active={open}
      maxWidth="sm"
      title={story?.title}
      fullScreen={onMobile}
      onClose={() => onClose()}
    >
      {currentSubscription?.subscriptionPlanName === "Free" && !currentUserIsAdmin ? (
          <div>
            <div>
              <p className="mt-4">
                <span className="font-semibold">{'"Read While Listening"'}</span> feature is exclusively available to our premium users.
              Upgrade to premium today to enjoy this feature along with many other benefits!
              </p>
            </div>
            <div className="justify-end flex gap-x-2 mt-10">
                <STKButton variant="text" onClick={() => onClose()}>Close</STKButton>
              <div>
                <STKButton onClick={redirectToAccountSettings}>
                  Upgrade now
                </STKButton>
              </div>
            </div>
          </div>
      ) : (
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
                  onPlaying={handlePlaying}
                  // @ts-ignore
                  onTimeChange={handleOnTimeChange}
              />
            </div>
            <div
                className="mt-6"
                ref={transcriptRef}
                style={{
                  maxHeight: onMobile ? "calc(100vh - 220px)" : "400px",
                  overflowY: "auto",
                }}
            >
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
                  <p
                      className="text-lg leading-8"
                      dangerouslySetInnerHTML={renderTranscript()}
                  />
              )}
            </div>
          </form>
      )}
    </STKDialog>
  );
}
