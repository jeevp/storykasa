import {
    CheckCircle,
    NumberCircleOne,
    NumberCircleThree,
    NumberCircleTwo,
} from '@phosphor-icons/react'
import dynamic from 'next/dynamic';

import { SetStateAction, useContext, useState} from 'react'
import ProfileContext from '@/contexts/ProfileContext'
import {ageGroups, languages} from '@/app/enums'
import {useRouter} from 'next/navigation'
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import useDevice from "@/customHooks/useDevice";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKTextField from "@/components/STKTextField/STKTextField";
import UploadStoryDialog from "@/composedComponents/UploadStoryDialog/UploadStoryDialog";
import STKButton from "@/components/STKButton/STKButton";
import StorageHandler from "@/handlers/StorageHandler";
import {RECORD_BUCKET_NAME, RECORD_FILE_EXTENSION} from "@/config";
import StoryHandler from "@/handlers/StoryHandler";
const STKRecordAudio = dynamic(() => import('@/components/STKRecordAudio/STKRecordAudio'), {
    ssr: false,  // Set to false to disable server-side rendering
});

export default function StoryForm() {
    const {currentProfileId} = useContext(ProfileContext) as any
    const {onMobile} = useDevice()

    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState("")
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioDuration, setAudioDuration] = useState(0)
    const [audioURL, setAudioURL] = useState('')
    const [language, setLanguage] = useState('')
    const [ageGroup, setAgeGroup] = useState('')
    const [showUploadStoryDialog, setShowUploadStoryDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateAudioBlob = (blob: Blob, url: string) => {
        setAudioBlob(blob)
        setAudioURL(url)
    }

    const uploadAndAddStory = async () => {
        try {
            setLoading(true)
            if (!audioBlob) throw new Error('missing audio for story')
            // create form to upload audio blob to bucket
            const audioFormData = new FormData()
            audioFormData.set('file', audioBlob)

            // @ts-ignore
            audioFormData.set('uploadDetails', JSON.stringify({
                bucketName: RECORD_BUCKET_NAME,
                extension: RECORD_FILE_EXTENSION
            }));

            // get the public URL of the recording after uploading to bucket
            const recordingURL = await StorageHandler.uploadFile(audioFormData)
            // add public URL and recording duration to story form data
            const storyFormData = new FormData()
            storyFormData.set('recording_url', recordingURL)
            storyFormData.set('duration', String(audioDuration))
            storyFormData.set('recorded_by', currentProfileId)
            storyFormData.set('title', title)
            storyFormData.set('description', description)
            storyFormData.set('language', language)
            storyFormData.set('age_group', ageGroup)

            await StoryHandler.createStory({
                recordingURL,
                duration: String(audioDuration),
                recordedBy: currentProfileId,
                title,
                description,
                language,
                ageGroup
            })

            setShowUploadStoryDialog(true)
        } finally {
            setLoading(false)
        }
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
            <div className="lg:pr-2 mt-2">
                <div className="flex items-center">
                    <NumberCircleOne size={28} />
                    <h3 className="font-semibold m-0 ml-1">
                        Describe your story
                    </h3>
                </div>

                <div className="flex flex-col mt-2">
                    <div>
                        <label className="font-semibold">
                            Story title
                        </label>
                        <div className="mt-2">
                            <STKTextField onChange={(value: SetStateAction<string>) => setTitle(value)} fluid />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="font-semibold">
                            Description
                        </label>
                        <div className="mt-2">
                            <STKTextField
                                multiline
                                fluid
                                onChange={(value: SetStateAction<string>) => setDescription(value)} />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row mt-6">
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Language
                            </label>
                            <div className="mt-2">
                                <STKAutocomplete
                                    options={languages}
                                    optionLabel="name"
                                    fluid={onMobile}
                                    onChange={handleLanguageOnChange} />
                            </div>
                        </div>
                        <div className="lg:ml-4 flex flex-col mt-6 lg:mt-0">
                            <label className="font-semibold">
                                Age range
                            </label>
                            <div className="mt-2">
                                <STKSelect
                                    options={ageGroups}
                                    optionLabel="name"
                                    optionValue="code"
                                    fluid={onMobile}
                                    onChange={handleAgeGroupOnChange}  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:pr-2 mt-6">
                <div className={`flex items-center ${title.length ? '' : 'disabled'}`}>
                    <NumberCircleTwo size={28} />
                    <label className="font-semibold ml-1">
                        {!audioBlob && 'Record your story'}
                        {audioBlob && 'Preview your story'}
                    </label>
                </div>
                <div className="mt-4">
                    {audioBlob ? (
                        <STKAudioPlayer src={audioURL} outlined />
                    ) : (
                        <STKRecordAudio onComplete={updateAudioBlob} onDuration={(duration: number) => setAudioDuration(duration)} />
                    )}
                </div>

                <div className={`mt-6 ${title.length && audioBlob ? '' : 'disabled'}`}>
                    <div className="flex items-center">
                        <NumberCircleThree size={28} />
                        <div>
                            <label className="font-semibold ml-1">
                                Save your story
                            </label>
                        </div>
                    </div>
                    <p className="ml-4 mt-1">
                        When you add a story to your library, only profiles in your
                        account will be able to listen to it.
                    </p>
                    <div className="flex lg:flex-row flex-col items-center justify-center mt-8 lg:justify-end">
                        {/*<AlertDialog.Root>*/}
                        {/*    <AlertDialog.Trigger>*/}
                        {/*        <Button*/}
                        {/*            className="w-full lg:w-auto"*/}
                        {/*            color="tomato"*/}
                        {/*            variant="outline"*/}
                        {/*            radius="full"*/}
                        {/*            size="3"*/}
                        {/*            type="button"*/}
                        {/*        >*/}
                        {/*            <Trash size={20}></Trash>*/}
                        {/*            <Text>Delete recording</Text>*/}
                        {/*        </Button>*/}
                        {/*    </AlertDialog.Trigger>*/}
                        {/*    <AlertDialog.Content style={{ maxWidth: 450, margin: 20 }}>*/}
                        {/*        <AlertDialog.Title>Delete recording?</AlertDialog.Title>*/}
                        {/*        <AlertDialog.Description size="2">*/}
                        {/*            Are you sure you want to delete this recording and start*/}
                        {/*            over?*/}
                        {/*        </AlertDialog.Description>*/}

                        {/*        <Flex gap="3" mt="4" justify="end">*/}
                        {/*            <AlertDialog.Cancel>*/}
                        {/*                <Button variant="soft" color="gray">*/}
                        {/*                    Cancel*/}
                        {/*                </Button>*/}
                        {/*            </AlertDialog.Cancel>*/}
                        {/*            <AlertDialog.Action>*/}
                        {/*                <Button onClick={() => setAudioBlob(null)} color="red">*/}
                        {/*                    <Trash size={20}></Trash>*/}
                        {/*                    Yes, delete recording*/}
                        {/*                </Button>*/}
                        {/*            </AlertDialog.Action>*/}
                        {/*        </Flex>*/}
                        {/*    </AlertDialog.Content>*/}
                        {/*</AlertDialog.Root>*/}
                        <div className="ml-0 lg:ml-2 mt-2 lg:mt-0 w-full lg:w-auto">
                            <div>
                                <STKButton
                                loading={loading}
                                startIcon={<CheckCircle size={24} weight="duotone" />}
                                onClick={uploadAndAddStory}>
                                    Save to library
                                </STKButton>
                            </div>

                            <UploadStoryDialog
                                open={showUploadStoryDialog}
                                onClose={() => setShowUploadStoryDialog(false)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
