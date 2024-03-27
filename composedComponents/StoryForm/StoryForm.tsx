import {
    CheckCircle, NumberCircleFour,
    NumberCircleOne,
    NumberCircleThree,
    NumberCircleTwo,
} from '@phosphor-icons/react'
import dynamic from 'next/dynamic';

import {SetStateAction, useEffect, useState} from 'react'
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
    ILLUSTRATIONS_BUCKET_NAME,
    STK_ACCESS_TOKEN
} from "@/config";
import StoryHandler from "@/handlers/StoryHandler";
import CancelRecordingDialog from "@/composedComponents/CancelRecordingDialog/CancelRecordingDialog";
import STKRadioGroup from "@/components/STKRadioGroup/STKRadioGroup";
import STKUploadFile from "@/components/STKUploadFile/STKUploadFile";
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useAuth} from "@/contexts/auth/AuthContext";
import InfoDialog from "@/composedComponents/InfoDialog/InfoDialog"
import {useRouter} from "next/router";
import {useStory} from "@/contexts/story/StoryContext";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {purple600} from "@/assets/colorPallet/colors";

const STKRecordAudio = dynamic(() => import('@/components/STKRecordAudio/STKRecordAudio'), {
    ssr: false,  // Set to false to disable server-side rendering
});

const RECORD_STORY_CREATION_METHOD = "RECORD_STORY_CREATION_METHOD"
const UPLOAD_STORY_CREATION_METHOD = "UPLOAD_STORY_CREATION_METHOD"

export default function StoryForm({ unfinishedStory, storyIdea, onSave }: { unfinishedStory: any, storyIdea: any, onSave: () => void }) {
    const {currentProfileId} = useProfile()
    const {onMobile} = useDevice()
    const { currentUser, setCurrentUser } = useAuth()
    const { currentGuestDemoStory, setCurrentGuestDemoStory } = useStory()
    const { setSnackbarBus } = useSnackbar()

    const router = useRouter()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState("")
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioDuration, setAudioDuration] = useState(0)
    const [audioURL, setAudioURL] = useState('')
    const [language, setLanguage] = useState("")
    const [ageGroups, setAgeGroups] = useState([])
    const [showUploadStoryDialog, setShowUploadStoryDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showCancelRecordingDialog, setShowCancelRecordingDialog] = useState(false)
    const [storyCreationMethod, setStoryCreationMethod] = useState(RECORD_STORY_CREATION_METHOD)
    const [storyIllustrations, setStoryIllustrations] = useState<Array<Blob>>([])
    const [showMustSignUpDialog, setShowMustSignUpDialog] = useState(false)
    const [draftStory, setDraftStory] = useState(null)
    const [loadingAutoSave, setLoadingAutoSave] = useState(false)
    const [showStoryAudioInfo, setShowStoryAudioInfo] = useState(false)
    const [unfinishedStoryRecordingURL, setUnfinishedStoryRecordingURL] = useState("")


    useEffect(() => {
        if (currentGuestDemoStory) {
            setTitle(currentGuestDemoStory.title)
            setDescription(currentGuestDemoStory.description)
            setAudioBlob(currentGuestDemoStory.audioBlob)
            setAudioDuration(currentGuestDemoStory.audioDuration)
            setAudioURL(currentGuestDemoStory.audioURL)
            setLanguage(currentGuestDemoStory.language)
            setAgeGroups(currentGuestDemoStory.ageGroups)
            setStoryCreationMethod(currentGuestDemoStory.storyCreationMethod)
            setStoryIllustrations(currentGuestDemoStory.storyIllustrations)
        }
    }, []);

    // Watchers

    useEffect(() => {
        if (unfinishedStory) {
            preFillStoryForm(unfinishedStory)
            setUnfinishedStoryRecordingURL(unfinishedStory.recordingUrl)
        }
    }, [unfinishedStory]);

    useEffect(() => {
        if (
            storyIdea
            && storyIdea.title !== title
            && storyIdea.fullDescription !== description
        ) {
            console.log({ storyIdea })
            preFillStoryForm(storyIdea)
            setAudioURL("")
            setAudioBlob(null)
        }
    }, [storyIdea]);

    useEffect(() => {
        setAudioBlob(null)
    }, [storyCreationMethod]);

    const preFillStoryForm = (data: any) => {
        setTitle(data?.title)
        setDescription(data?.description || data?.fullDescription)
        setLanguage(data?.language)
        setAgeGroups(data?.ageGroups || [])
    }

    const updateAudioBlob = async (blob: Blob, url: string, duration: number) => {
        setAudioDuration(duration)
        setAudioBlob(blob)
        setAudioURL(url)
        setShowStoryAudioInfo(true)
    }

    const generateRecordingURL = async () => {
        let recordingURL = ""

        if (audioBlob) {
            const audioFormData = new FormData()
            audioFormData.set('file', audioBlob)

            // @ts-ignore
            audioFormData.set('uploadDetails', JSON.stringify({
                bucketName: RECORD_BUCKET_NAME,
                extension: RECORD_FILE_EXTENSION
            }));

            recordingURL = await StorageHandler.uploadFile(audioFormData)

            return recordingURL
        }
    }

    const autoSaveStory = async () => {
        if (currentUser?.isGuest) {
            setShowMustSignUpDialog(true)
            return
        }

        setLoadingAutoSave(true)
        // create form to upload audio blob to bucket

        const recordingURL = await generateRecordingURL()

        // add public URL and recording duration to story form data
        const storyFormData = new FormData()
        // @ts-ignore
        storyFormData.set('recording_url', recordingURL)
        storyFormData.set('duration', String(audioDuration))
        storyFormData.set('recorded_by', currentProfileId)
        storyFormData.set('title', title)
        storyFormData.set('description', description)
        storyFormData.set('language', language)
        // @ts-ignore
        storyFormData.set('age_groups', ageGroups || [])

        const storyData = {
            recordingURL,
            duration: String(audioDuration),
            title,
            description,
            language,
            ageGroups
        }

        if (unfinishedStory) {
            await StoryHandler.updateStory({
                storyId: unfinishedStory.storyId
                // @ts-ignore
            }, { ...storyData })
        } else {
            // @ts-ignore
            const draftStory = await StoryHandler.createStory({
                ...storyData
            }, { profileId: currentProfileId })
            // @ts-ignore
            setDraftStory(draftStory)
        }

        setSnackbarBus({
            active: true,
            message: "Story saved as draft.",
            type: "success"
        })
        setLoadingAutoSave(false)
    }

    const saveStory = async () => {
        try {
            if (currentUser?.isGuest) {
                setShowMustSignUpDialog(true)
                return
            }

            setLoading(true)

            // @ts-ignore
            const storyId = draftStory?.storyId || unfinishedStory?.storyId
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

            // @ts-ignore
            const recordingURL = await generateRecordingURL()
            if (!storyId) {
                const storyData = {
                    recordingURL,
                    duration: String(audioDuration),
                    title,
                    description,
                    language,
                    ageGroups,
                    finished: true
                }

                // @ts-ignore
                await StoryHandler.createStory({ ...storyData }, { profileId: currentProfileId })
            } else {
                await StoryHandler.updateStory({ storyId }, {
                    finished: true,
                    // @ts-ignore
                    illustrationsURL,
                    recordingURL
                })
            }

            setShowUploadStoryDialog(true)
            onSave()
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

    const handleGoToSignUp = async () => {
        await router.push("/signup")
        localStorage.removeItem(STK_ACCESS_TOKEN)
        setCurrentUser(null)
        const _currentGuestDemoStory =  {
            title,
            description,
            audioBlob,
            audioBlobType: audioBlob?.type,
            audioDuration,
            audioURL,
            language,
            ageGroups,
            storyCreationMethod,
            storyIllustrations
        }

        setCurrentGuestDemoStory(_currentGuestDemoStory)
    }

    const clearRecording = () => {
        setAudioURL("")
        setAudioBlob(null)
        setAudioDuration(0)
        setUnfinishedStoryRecordingURL("")
    }


    const storyIsIncomplete = (
        !language
        || !title
        || !description
        || (!audioURL && !unfinishedStory?.recordingUrl)
        || ageGroups.length === 0
    )

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
                            <STKTextField onChange={(value: SetStateAction<string>) => setTitle(value)} fluid value={title} />
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
                                enableRichText
                                value={description}
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
                                    optionValue="code"
                                    fluid={onMobile}
                                    value={languages.find((lang) => lang.name === language)}
                                    placeholder="Select a language"
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
                                    placeholder="Select an age group"
                                    enableSelectAll
                                    selectAllLabel="All ages"
                                    multiple
                                    // @ts-ignore
                                    value={allowedAgeGroups?.every(group => ageGroups?.includes(group.value)) ? [""] : allowedAgeGroups.filter((group) => ageGroups.includes(group.value)) }
                                    fluid={onMobile}
                                    onChange={handleAgeGroupOnChange}  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className={`lg:pr-2 mt-6 ${title?.length ? '' : 'disabled'}`}>
                <div className={`flex items-center mb-4`}>
                    <NumberCircleTwo size={28} />
                    <label className="font-semibold ml-1">Your story</label>
                </div>
                {storyIdea?.setting ? (
                    <div className="p-4 w-auto inline-block bg-purple-50 rounded-2xl mb-4">
                        <div className="flex items-center">
                            <TipsAndUpdatesIcon sx={{ color: purple600 }} />
                            <label className="ml-2 font-semibold">Setting</label>
                        </div>
                        <p className="mt-2">{storyIdea?.setting}</p>
                    </div>
                ) : null}

                {storyIdea?.firstLine ? (
                    <div className="p-4 w-auto inline-block bg-purple-50 rounded-2xl mb-4">
                        <div className="flex items-center">
                            <TipsAndUpdatesIcon sx={{ color: purple600 }} />
                            <label className="ml-2 font-semibold">First line</label>
                        </div>
                        <p className="mt-2">{storyIdea?.firstLine}...</p>
                    </div>
                ) : null}
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
                        <STKAudioPlayer
                        src={audioURL}
                        outlined
                        clearable
                        customDuration={audioDuration}
                        onClear={clearRecording}/>
                    ) : (
                        <>
                            {storyCreationMethod === RECORD_STORY_CREATION_METHOD ? (
                                <div>
                                    {unfinishedStoryRecordingURL ? (
                                        <div className="mb-2">
                                            <STKAudioPlayer
                                            customDuration={unfinishedStory?.duration}
                                            outlined
                                            clearable
                                            src={unfinishedStory?.recordingUrl}
                                            onClear={clearRecording}/>
                                        </div>
                                    ) : null}
                                    <STKRecordAudio
                                        onComplete={updateAudioBlob}
                                        startButtonText={unfinishedStory ? "Continue recording" : "Start recording"}
                                        // @ts-ignore
                                        audioURL={storyIdea ? null : unfinishedStoryRecordingURL ? unfinishedStoryRecordingURL : null}
                                        onDuration={(duration: number) => setAudioDuration(duration)} />
                                </div>
                            ) : (
                                <div>
                                    <STKUploadFile
                                    // @ts-ignore
                                        maxSize={50}
                                        placeholder="Drag & drop a MP3 or M4A file here, or click to select one"
                                        acceptedTypes={["audio/mp3", "audio/mpeg", "audio/mp4", "audio/x-m4a"]}
                                        errorMessage="Please upload a valid MP3 or M4A file."
                                    onFileUpload={handleStoryAudioFileOnUpload} />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-6">
                    <div className={`flex items-center ${title?.length ? '' : 'disabled'}`}>
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

                <div className={`mt-6 ${unfinishedStory || title?.length && audioBlob ? '' : 'disabled'}`}>
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
                                disabled={storyIsIncomplete}
                                startIcon={<CheckCircle size={24} weight="duotone" />}
                                onClick={saveStory}>
                                    Save to library
                                </STKButton>
                            </div>
                            <div className="mt-4 ml-0 lg:ml-2 lg:mt-0">
                                <STKButton
                                    fullWidth={onMobile}
                                    variant="outlined"
                                    loading={loadingAutoSave}
                                    onClick={autoSaveStory}>
                                    Finish later
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
            <InfoDialog
            active={showMustSignUpDialog}
            title="Save Your Story"
            text="Your story is ready to be saved and shared with the world! To keep it safe and accessible anytime, please sign up. It's quick, easy, and opens up a world of exclusive features!"
            confirmationButtonText="Sign up"
            onAction={handleGoToSignUp}
            onClose={() => setShowMustSignUpDialog(false)}
            />

            <InfoDialog
                active={showStoryAudioInfo}
                text="To review your recording, simply play it back. When you're satisfied and ready to save it, select &quot;Save to Library&quot;. If you intend to return and further edit your recording, choose &quot;Finish Later.&quot;"
                title=""
                onAction={handleGoToSignUp}
                onClose={() => setShowStoryAudioInfo(false)}
            />
        </div>
    )
}
