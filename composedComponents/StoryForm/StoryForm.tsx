import {
    CheckCircle, NumberCircleFour,
    NumberCircleOne,
    NumberCircleThree,
    NumberCircleTwo,
} from '@phosphor-icons/react'
import dynamic from 'next/dynamic';

import { SetStateAction, useContext, useState} from 'react'
import ProfileContext from '@/contexts/ProfileContext'
import {allowedAgeGroups, languages} from "@/models/Story"
import STKAudioPlayer from "@/components/STKAudioPlayer/STKAudioPlayer";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import useDevice from "@/customHooks/useDevice";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKTextField from "@/components/STKTextField/STKTextField";
import UploadStoryDialog from "@/composedComponents/UploadStoryDialog/UploadStoryDialog";
import STKButton from "@/components/STKButton/STKButton";
import StorageHandler from "@/handlers/StorageHandler";
import {
    RECORD_BUCKET_NAME,
    RECORD_FILE_EXTENSION,
    PNG_FILE_EXTENSION,
    ILLUSTRATIONS_BUCKET_NAME
} from "@/config";
import StoryHandler from "@/handlers/StoryHandler";
import CancelRecordingDialog from "@/composedComponents/CancelRecordingDialog/CancelRecordingDialog";
import STKRadioGroup from "@/components/STKRadioGroup/STKRadioGroup";
import STKUploadFile from "@/components/STKUploadFile/STKUploadFile";
const STKRecordAudio = dynamic(() => import('@/components/STKRecordAudio/STKRecordAudio'), {
    ssr: false,  // Set to false to disable server-side rendering
});

const RECORD_STORY_CREATION_METHOD = "RECORD_STORY_CREATION_METHOD"
const UPLOAD_STORY_CREATION_METHOD = "UPLOAD_STORY_CREATION_METHOD"

export default function StoryForm() {
    const {currentProfileId} = useContext(ProfileContext) as any
    const {onMobile} = useDevice()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState("")
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioDuration, setAudioDuration] = useState(0)
    const [audioURL, setAudioURL] = useState('')
    const [language, setLanguage] = useState('')
    const [ageGroups, setAgeGroups] = useState('')
    const [showUploadStoryDialog, setShowUploadStoryDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showCancelRecordingDialog, setShowCancelRecordingDialog] = useState(false)
    const [storyCreationMethod, setStoryCreationMethod] = useState(RECORD_STORY_CREATION_METHOD)
    const [storyIllustrations, setStoryIllustrations] = useState<Array<Blob>>([])

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

            // @ts-ignore
            const illustrationsURL = []
            await Promise.all(storyIllustrations.map(async(illustrationBob) => {
                const illustrationFormData = new FormData()
                illustrationFormData.set('file', illustrationBob)
                illustrationFormData.set('uploadDetails', JSON.stringify({
                    bucketName: ILLUSTRATIONS_BUCKET_NAME,
                    extension: PNG_FILE_EXTENSION
                }));

                const illustrationURL = await StorageHandler.uploadFile(illustrationFormData)
                illustrationsURL.push(illustrationURL)
            }))

            // add public URL and recording duration to story form data
            const storyFormData = new FormData()
            storyFormData.set('recording_url', recordingURL)
            storyFormData.set('duration', String(audioDuration))
            storyFormData.set('recorded_by', currentProfileId)
            storyFormData.set('title', title)
            storyFormData.set('description', description)
            storyFormData.set('language', language)
            storyFormData.set('age_groups', ageGroups)

            await StoryHandler.createStory({
                recordingURL,
                duration: String(audioDuration),
                recordedBy: currentProfileId,
                title,
                description,
                language,
                ageGroups,
                // @ts-ignore
                illustrationsURL
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

    const handleAgeGroupOnChange = (selectedAgeGroups: SetStateAction<string>) => {
        // @ts-ignore
        setAgeGroups(selectedAgeGroups)
    }


    const handleStoryAudioFileOnUpload = (blob: any, url: any, duration: any) => {
        setAudioBlob(blob)
        setAudioURL(url)
        setAudioDuration(duration)
    }

    const handleIllustrationsOnUpload = (blob: any) => {
        storyIllustrations.push(blob)
    }

    // @ts-ignore
    return (
        <div className="pb-32 lg:pb-0">
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
                                    options={allowedAgeGroups}
                                    optionLabel="name"
                                    multiple
                                    value={[]}
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
                    <label className="font-semibold ml-1">Your story</label>
                </div>
                <div className="mt-4">
                    <div className="mb-4">
                        <STKRadioGroup
                        options={[
                            { label: "Record your story", value: RECORD_STORY_CREATION_METHOD },
                            { label: "Upload your story", value: UPLOAD_STORY_CREATION_METHOD }
                        ]}
                        value={RECORD_STORY_CREATION_METHOD}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(creationMethod: any) => setStoryCreationMethod(creationMethod)}/>
                    </div>
                    {audioBlob ? (
                        <STKAudioPlayer src={audioURL} outlined />
                    ) : (
                        <>
                            {storyCreationMethod === RECORD_STORY_CREATION_METHOD ? (
                                <STKRecordAudio onComplete={updateAudioBlob} onDuration={(duration: number) => setAudioDuration(duration)} />
                            ) : (
                                <div>

                                    <STKUploadFile
                                    // @ts-ignore
                                        maxSize={50}
                                        placeholder="Drag & drop an MP3 file here, or click to select one"
                                        acceptedTypes={["audio/mp3", "audio/mpeg"]}
                                        errorMessage="Please upload a valid MP3 file."
                                    onFileUpload={handleStoryAudioFileOnUpload} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-6">
                    <div className={`flex items-center ${title.length ? '' : 'disabled'}`}>
                        <NumberCircleThree size={28} />
                        <label className="font-semibold ml-1">Illustrations</label>
                    </div>
                    <div className="mt-4">
                        <STKUploadFile
                            // @ts-ignore
                            multiple
                            placeholder="Drag & drop the images here, or click to select"
                            maxSize={10}
                            maxFiles={15}
                            acceptedTypes={["image/png", "image/jpeg"]}
                            helperText="Up to 15 images allowed"
                            errorMessage="Please upload a valid PNG or JPEG file."
                            onFileUpload={handleIllustrationsOnUpload}/>
                    </div>
                </div>

                <div className={`mt-6 ${title.length && audioBlob ? '' : 'disabled'}`}>
                    <div className="flex items-center">
                        <NumberCircleFour size={28} />
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
                        <div className="ml-0 lg:ml-2 mt-2 block lg:flex lg:mt-0 w-full lg:w-auto">
                            <div>
                                <STKButton
                                loading={loading}
                                fullWidth={onMobile}
                                startIcon={<CheckCircle size={24} weight="duotone" />}
                                onClick={uploadAndAddStory}>
                                    Save to library
                                </STKButton>
                            </div>
                            <div className="mt-4 ml-0 lg:ml-2 lg:mt-0">
                                <STKButton
                                    fullWidth={onMobile}
                                    variant="outlined"
                                    onClick={() => setShowCancelRecordingDialog(true)}>
                                    Cancel
                                </STKButton>
                            </div>

                            <UploadStoryDialog
                                open={showUploadStoryDialog}
                                onClose={() => setShowUploadStoryDialog(false)} />

                            <CancelRecordingDialog
                            open={showCancelRecordingDialog}
                            onClose={() => setShowCancelRecordingDialog(false)}
                            onDeleteRecording={() => setAudioBlob(null)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
