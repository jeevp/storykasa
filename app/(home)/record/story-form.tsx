'use client'

import {
  Bookmark,
  Books,
  CheckCircle,
  NumberCircleOne,
  NumberCircleThree,
  NumberCircleTwo,
  Sparkle,
  Trash,
  TrashSimple,
} from '@phosphor-icons/react'

import {
  AlertDialog,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Grid,
  Select,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes'
import { Label } from '@radix-ui/react-label'
import { addStory, uploadRecording } from '../../../lib/_actions'
import { useContext, useState } from 'react'
import { ProfileContext } from '../../profile-provider'
import { ageGroups, languages } from '@/app/enums'
import { useRouter } from 'next/navigation'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
import STKRecordAudio from "@/app/components/STKRecordAudio/STKRecordAudio";

export default function StoryForm() {
  const { currentProfileID } = useContext(ProfileContext) as any

  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState("")
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioURL, setAudioURL] = useState('')
  const [language, setLanguage] = useState('')
  const [ageGroup, setAgeGroup] = useState('')

  const updateAudioBlob = (blob: Blob, url: string) => {
    setAudioBlob(blob)
    setAudioURL(url)
  }

  const uploadAndAddStory = async () => {
    if (!audioBlob) throw new Error('missing audio for story')

    // create form to upload audio blob to bucket
    const audioFormData = new FormData()
    audioFormData.set('recording', audioBlob)

    // get the public URL of the recording after uploading to bucket
    const recordingURL = await uploadRecording(audioFormData)

    // add public URL and recording duration to story form data
    const storyFormData = new FormData()
    storyFormData.set('recording_url', recordingURL)
    storyFormData.set('duration', String(audioDuration))
    storyFormData.set('recorded_by', currentProfileID)
    storyFormData.set('title', title)
    storyFormData.set('description', description)
    storyFormData.set('language', language)
    storyFormData.set('age_group', ageGroup)

    await addStory(storyFormData)
  }

  const handleGoToLibrary = () => {
    router.push('/library')
  }

  return (
      <div>
        <Box className="lg:pr-2" mt="4">
          <Flex align="center">
            <NumberCircleOne size={28} />
            <Text weight="medium" ml="2" size="3">
              Describe your story
            </Text>
          </Flex>

          <Flex direction="column" gap="3" mt="3">
            <Label>
              <Text weight="medium" size="2">
                Story title
              </Text>
              <TextField.Input
                variant="soft"
                name="title"
                value={title}
                size="3"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Label>
            <Label>
              <Text weight="medium" size="2">
                Description
              </Text>
              <TextArea
                variant="soft"
                size="2"
                placeholder="Briefly describe your story"
                style={{ height: 160 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>

            <Flex asChild direction="column" gap="1">
              <Label>
                <Text weight="medium" size="2">
                  Language
                </Text>
                <Select.Root name="language" onValueChange={(value) => setLanguage(value)}>
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
                <Text weight="medium" size="2">
                  Age range
                </Text>
                <Select.Root name="age_group" onValueChange={(value) => setAgeGroup(value)}>
                  <Select.Trigger placeholder="Choose an age range" />
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
          </Flex>
        </Box>

        <Box className="lg:pr-2" mt="4">
          <Flex align="center" className={title.length ? '' : 'disabled'}>
            <NumberCircleTwo size={28} />
            <Text weight="medium" ml="2" size="3">
              {!audioBlob && 'Record your story'}
              {audioBlob && 'Preview your story'}
            </Text>
          </Flex>
          <Card
            mt="4"
            size="3"
            variant="surface"
            className={title.length ? '' : 'disabled'}
          >
            {audioBlob ? (
                <STKAudioPlayer src={audioURL} />
            ) : (
                <STKRecordAudio onComplete={updateAudioBlob} onDuration={(duration: number) => setAudioDuration(duration)} />
            )}
          </Card>

          <Box className={title.length && audioBlob ? '' : 'disabled'}>
            <Flex align="center" mt="8">
              <NumberCircleThree size={28} />
              <Box>
                <Text weight="medium" ml="2" size="3">
                  Save your story
                </Text>
              </Box>
            </Flex>
            <Text ml="7" as="p" size="2" mt="2">
              When you add a story to your library, only profiles in your
              account will be able to listen to it.
            </Text>
            <div className="flex lg:flex-row flex-col items-center justify-center mt-8 lg:justify-end">
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    className="w-full lg:w-auto"
                    color="tomato"
                    variant="outline"
                    radius="full"
                    size="3"
                    type="button"
                  >
                    <Trash size={20}></Trash>
                    <Text>Delete recording</Text>
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content style={{ maxWidth: 450, margin: 20 }}>
                  <AlertDialog.Title>Delete recording?</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    Are you sure you want to delete this recording and start
                    over?
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button onClick={() => setAudioBlob(null)} color="red">
                        <Trash size={20}></Trash>
                        Yes, delete recording
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
              <div className="ml-2 mt-2 lg:mt-0 w-full lg:w-auto">
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button
                      className="w-full lg:w-auto"
                      size="3"
                      color="grass"
                      radius="full"
                      onClick={uploadAndAddStory}>
                      <CheckCircle size={24} weight="duotone" />
                      <Text>Save to library</Text>
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content style={{ maxWidth: 450, margin: 20 }}>
                    <AlertDialog.Title>Added to your library!</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Congratulations on your brand new story. Go to your library
                      to listen to it.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button onClick={handleGoToLibrary} color="grass">
                          <Books size="20"></Books>
                          Go to my library
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </div>
            </div>
          </Box>
        </Box>
      </div>
  )
}
