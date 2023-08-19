'use client'

import { Sparkle } from '@phosphor-icons/react'

import {
  Button,
  Card,
  Flex,
  Select,
  Text,
  TextArea,
  TextField,
  Theme,
} from '@radix-ui/themes'
import { Label } from '@radix-ui/react-label'
import AudioRecorder from './audio-recorder'
import { addStory, uploadRecording } from '../../../lib/_actions'
import { useContext, useState } from 'react'
import AudioPreview from './audio-preview'
import { ProfileContext } from '../../profile-provider'
import { Profile } from '../../../lib/database-helpers.types'

export default function StoryForm() {
  const { currentProfileID } = useContext(ProfileContext) as any

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioURL, setAudioURL] = useState('')

  const updateAudioBlob = (blob: Blob, duration: number, url: string) => {
    setAudioBlob(blob)
    setAudioDuration(duration)
    setAudioURL(url)
  }

  const uploadAndAddStory = async (storyFormData: FormData) => {
    if (!audioBlob) throw new Error('missing audio for story')

    // create form to upload audio blob to bucket
    const audioFormData = new FormData()
    audioFormData.set('recording', audioBlob)

    // get the public URL of the recording after uploading to bucket
    const recordingURL = await uploadRecording(audioFormData)

    // add public URL and recording duration to story form data
    storyFormData.set('recording_url', recordingURL)
    storyFormData.set('duration', String(audioDuration))
    storyFormData.set('recorded_by', currentProfileID)

    await addStory(storyFormData)
  }

  return (
    <Card size="3">
      <Theme radius="small">
        <AudioRecorder onRecorded={updateAudioBlob}></AudioRecorder>

        {audioBlob && (
          <form action={uploadAndAddStory}>
            <AudioPreview src={audioURL}></AudioPreview>
            <Flex direction="column" gap="4">
              <Flex asChild direction="column" gap="1">
                <Label>
                  <Text weight="bold" size="1">
                    Story title
                  </Text>
                  <TextField.Input variant="soft" name="title" />
                </Label>
              </Flex>

              <Flex asChild direction="column" gap="1">
                <Label>
                  <Text weight="bold" size="1">
                    Description
                  </Text>
                  <TextArea
                    variant="soft"
                    size="1"
                    placeholder="Briefly describe your story"
                    name="description"
                  />
                </Label>
              </Flex>

              <Flex asChild direction="column" gap="1">
                <Label>
                  <Text weight="bold" size="1">
                    Language
                  </Text>
                  <Select.Root name="language">
                    <Select.Trigger placeholder="Choose a language" />
                    <Select.Content>
                      <Select.Item value="english">English</Select.Item>
                      <Select.Item value="spanish">Spanish</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Label>
              </Flex>

              <Flex asChild direction="column" gap="1">
                <Label>
                  <Text weight="bold" size="1">
                    Age range
                  </Text>
                  <Select.Root name="age">
                    <Select.Trigger placeholder="Choose a range" />
                    <Select.Content>
                      <Select.Item value="1-3">1-3</Select.Item>
                      <Select.Item value="4-6">4-6</Select.Item>
                      <Select.Item value="6-9">6-9</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Label>
              </Flex>
            </Flex>

            <Button
              mt="5"
              color="grass"
              className="raised"
              radius="full"
              type="submit"
            >
              <Sparkle weight="bold"></Sparkle>
              Save to your library
            </Button>
          </form>
        )}
      </Theme>
    </Card>
  )
}
