import {
  AudioRecorder as AudioVoiceRecorder,
  useAudioRecorder,
} from 'react-audio-voice-recorder'
import { useEffect, useState } from 'react'
import { Button, Flex, Text } from '@radix-ui/themes'
import { mmss } from '@/lib/utils'
import { DMMono } from '@/app/fonts'
import {
  PauseCircle,
  Record,
  StopCircle,
} from '@phosphor-icons/react'
import STKRecordAudio from "@/app/components/STKRecordAudio/STKRecordAudio";

export const dynamic = 'force-dynamic'

export default function AudioRecorder({ onRecorded }: { onRecorded: any }) {
  const [duration, setDuration] = useState(0)

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err: Error) => console.table(err) // onNotAllowedOrFound
  )

  useEffect(() => {
    if (recorderControls.recordingTime > 0) {
      setDuration(recorderControls.recordingTime)
    }
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recorderControls])

  const addAudioElement = async (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    onRecorded(blob, duration, url)
  }

  return (
    <div>
      {!recorderControls.recordingBlob && (
        <Flex justify="between" align="center" mb="4">
          {recorderControls.isRecording ? (
            recorderControls.isPaused ? (
              <Button
                onClick={recorderControls.togglePauseResume}
                variant="surface"
                color="gray"
                radius="full"
                type="button"
              >
                <Record size="20" weight="fill"></Record>
                <Text>Resume</Text>
              </Button>
            ) : (
              <Button
                onClick={recorderControls.togglePauseResume}
                variant="surface"
                color="gray"
                radius="full"
                type="button"
              >
                <PauseCircle size="20" weight="fill"></PauseCircle>
                <Text>Pause</Text>
              </Button>
            )
          ) : (
            !recorderControls.recordingBlob && (
              <Button
                onClick={recorderControls.startRecording}
                color="tomato"
                radius="full"
                variant="surface"
                type="button"
              >
                <Record size="20" weight="fill"></Record>
                <Text>Start recording</Text>
              </Button>
            )
          )}
          {recorderControls.isRecording && !recorderControls.recordingBlob && (
            <Button
              color="tomato"
              radius="full"
              variant="surface"
              type="button"
              onClick={recorderControls.stopRecording}
            >
              <StopCircle weight="fill" size="20" />
              <Text>Finish recording</Text>
            </Button>
          )}
        </Flex>
      )}

      <Flex
        justify="between"
        align="center"
        className={DMMono.className}
        style={
          recorderControls.isRecording || recorderControls.recordingBlob
            ? { opacity: 1 }
            : { opacity: 0.3 }
        }
      >
        <Flex className="w-9/12" justify="between" align="center" gap="3">
          <Flex align="center" gap="1">
            <Text weight="bold" size="2" color="gray">
              REC
            </Text>
            <div
              className={
                recorderControls.isRecording && !recorderControls.isPaused
                  ? 'rec-indicator'
                  : 'rec-indicator paused'
              }
            ></div>
          </Flex>

          <STKRecordAudio />
          {/*<AudioVoiceRecorder*/}
          {/*  onRecordingComplete={(blob: Blob) => addAudioElement(blob)}*/}
          {/*  recorderControls={recorderControls}*/}
          {/*  showVisualizer={true}*/}
          {/*/>*/}
        </Flex>
        <Text size="7" weight="light">
          {duration ? mmss(duration) : mmss(recorderControls.recordingTime)}
        </Text>
      </Flex>
    </div>
  )
}
