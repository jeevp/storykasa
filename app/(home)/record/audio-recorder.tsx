// "react-media-recorder";

// or
// https://stackblitz.com/edit/react-ts-cc5l47?file=App.tsx

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

import {
  AudioRecorder as AudioVoiceRecorder,
  useAudioRecorder,
} from 'react-audio-voice-recorder'
import { useEffect, useState } from 'react'

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
    <AudioVoiceRecorder
      onRecordingComplete={(blob: Blob) => addAudioElement(blob)}
      recorderControls={recorderControls}
      // downloadOnSavePress={true}
      // downloadFileExtension="mp3"
      showVisualizer={true}
    />
  )
}
