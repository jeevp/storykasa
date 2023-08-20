'use client'

import { Bookmark, Books, Sparkle } from '@phosphor-icons/react'

import {
  AlertDialog,
  Button,
  Callout,
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
import { ageGroups, languages } from '@/app/enums'
import { useRouter } from 'next/navigation'

export default function StoryForm() {
  const { currentProfileID } = useContext(ProfileContext) as any

  const router = useRouter()

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

  const handleGoToLibrary = () => {
    router.push('/library')
  }

  return (
    <form action={uploadAndAddStory}>
      <Card>
        <Callout.Root>
          <Callout.Icon>
            <Text size="2">Step 1</Text>
          </Callout.Icon>
          <Callout.Text weight="bold">
            Tell the world about your story
          </Callout.Text>
        </Callout.Root>

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
                {languages.map((l) => (
                  <Select.Item key={l.code} value={l.name}>
                    {l.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Label>
        </Flex>

        <Flex asChild direction="column" gap="1">
          <Label>
            <Text weight="bold" size="1">
              Age range
            </Text>
            <Select.Root name="age_group">
              <Select.Trigger placeholder="Choose a range" />
              <Select.Content>
                {ageGroups.map((a) => (
                  <Select.Item key={a.name} value={a.name}>
                    {a.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Label>
        </Flex>
      </Card>
      <Card mt="3">
        <Callout.Root>
          <Callout.Icon>
            <Text size="2">Step 2</Text>
          </Callout.Icon>
          <Callout.Text weight="bold">
            Click the microphone to record your story
          </Callout.Text>
        </Callout.Root>

        <AudioRecorder onRecorded={updateAudioBlob}></AudioRecorder>

        {audioBlob && <AudioPreview src={audioURL}></AudioPreview>}
      </Card>

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button size="3" my="3" color="grass" type="submit">
            <Bookmark size={24} weight="duotone" />
            <Text>Save story to my library</Text>
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Added to your library!</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Congratulations on your brand new story. Go to your library to
            listen to it.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleGoToLibrary}>
                <Books size="20"></Books>
                Go to my library
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </form>
  )
}
