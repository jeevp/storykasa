'use client'

import {
  Books,
  CheckCircle,
  NumberCircleOne,
  NumberCircleThree,
  NumberCircleTwo,
  Trash,
} from '@phosphor-icons/react'

import {
  AlertDialog,
  Box,
  Button,
  Flex,
  Text,
} from '@radix-ui/themes'
import { Label } from '@radix-ui/react-label'
import { addStory, uploadRecording } from '../../../lib/_actions'
import { SetStateAction, useContext, useState} from 'react'
import {ProfileContext} from '../../profile-provider'
import {ageGroups, languages} from '@/app/enums'
import {useRouter} from 'next/navigation'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
import STKRecordAudio from "@/app/components/STKRecordAudio/STKRecordAudio";
import STKAutocomplete from "@/app/components/STKAutocomplete/STKAutocomplete";
import useDevice from "@/app/customHooks/useDevice";
import STKSelect from "@/app/components/STKSelect/STKSelect";
import STKTextField from "@/app/components/STKTextField/STKTextField";

export default function StoryForm() {
  const {currentProfileID} = useContext(ProfileContext) as any
  const {onMobile} = useDevice()

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

  const handleLanguageOnChange = (selectedLanguage: Object) => {
    // @ts-ignore
    setLanguage(selectedLanguage?.name)
  }

  const handleAgeGroupOnChange = (selectedAgeGroup: SetStateAction<string>) => {
    // @ts-ignore
    setAgeGroup(selectedAgeGroup.code)
  }

  return (
      <div>
        <Box className="lg:pr-2" mt="4">
          <Flex align="center">
            <NumberCircleOne size={28} />
            <Text className="font-semibold"  weight="medium" ml="2" size="3">
              Describe your story
            </Text>
          </Flex>

          <Flex direction="column" gap="3" mt="3">
            <div>
              <Text className="font-semibold" weight="medium" size="2">
                Story title
              </Text>
              <div>
                <STKTextField onChange={(value: SetStateAction<string>) => setTitle(value)} fluid={onMobile} />
              </div>
            </div>
            <div>
              <Text className="font-semibold"  weight="medium" size="2">
                Description
              </Text>
              <div>
                <STKTextField
                  multiline
                  fluid={onMobile}
                  onChange={(value: SetStateAction<string>) => setDescription(value)} />
              </div>
            </div>
            <Flex asChild direction="column" gap="1">
              <Label>
                <Text className="font-semibold"  weight="medium" size="2">
                  Language
                </Text>
                <STKAutocomplete
                  options={languages}
                  optionLabel="name"
                  fluid={onMobile}
                  onChange={handleLanguageOnChange} />
              </Label>
            </Flex>

            <Flex asChild direction="column" gap="1">
              <Label>
                <Text className="font-semibold"  weight="medium" size="2">
                  Age range
                </Text>
                <STKSelect
                  options={ageGroups}
                  optionLabel="name"
                  optionValue="code"
                  fluid={onMobile}
                  onChange={handleAgeGroupOnChange}  />
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
          <div className="mt-4">
            {audioBlob ? (
                <STKAudioPlayer src={audioURL} outlined />
            ) : (
                <STKRecordAudio onComplete={updateAudioBlob} onDuration={(duration: number) => setAudioDuration(duration)} />
            )}
          </div>

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
