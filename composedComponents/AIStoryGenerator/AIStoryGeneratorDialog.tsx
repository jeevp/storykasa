import STKDialog from "@/components/STKDialog/STKDialog";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKAutocomplete from "@/components/STKAutocomplete/STKAutocomplete";
import {allowedAgeGroups, languages} from "@/models/Story";
import STKSelect from "@/components/STKSelect/STKSelect";
import STKButton from "@/components/STKButton/STKButton";
import STKButtonTabs from "@/components/STKButtonTabs/STKButtonTabs";
import {useState} from "react";
import StoryHandler from "@/handlers/StoryHandler";
import STKAccordion from "@/components/STKAccordion/STKAccordion";
import useDevice from "@/customHooks/useDevice";


interface AIStoryGeneratorDialogProps {
    active: boolean,
    onClose: () => void
}

export default function AIStoryGeneratorDialog({
    active,
    onClose = () => ({})
}: AIStoryGeneratorDialogProps) {
    const { onMobile } = useDevice()

    const [loading, setLoading] = useState(false)
    const [isFictional, setIsFictional] = useState(false)
    const [language, setLanguage] = useState("")
    const [description, setDescription] = useState("")
    const [ageGroups, setAgeGroups] = useState([])
    const [storyIdeas, setStoryIdeas] = useState([])

    // Methods
    const handleGenerateStoryIdeas = async () => {
        setLoading(true)
        const storyIdeasResponse = await StoryHandler.generateStoryIdeas({
            isFictional,
            language,
            description,
            ageGroups
        })

        setStoryIdeas(storyIdeasResponse)
        setLoading(false)
    }


    return (
        <STKDialog
        active={active}
        fullScreen={onMobile}
        title="Story Idea Generator"
        maxWidth="md"
        aiMode
        onClose={() => onClose()}>
            <div className="mt-4">
                {storyIdeas?.length > 0 ? (
                    <div>
                        {storyIdeas?.map((storyIdea: any, index: number) => (
                            <div key={index} className="first:mt-0 mt-2">
                                <STKAccordion
                                    titlePrefix={`Idea ${index + 1}`}
                                    title={`"${storyIdea?.title}"`}
                                    titleSize="text-lg"
                                    defaultExpanded={index === 0}>
                                    <p>{storyIdea?.description}</p>
                                    <div>
                                        <ul>
                                            {storyIdea?.characters.map((character: string, index: number) => (
                                                <li key={index}>
                                                    <span className="font-semibold">{character?.name}</span>: {character?.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </STKAccordion>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p>
                            Let&quot;s help you tell your story! Respond to the prompts below to generate
                            some ideas. Then, choose one and make it your own.
                        </p>
                        <div className="flex mt-8">
                            <div className="w-1/3">
                                <div>
                                    <label className="font-semibold">1. Is your story fictional?</label>
                                    <div className="mt-2 ml-4">
                                        <STKButtonTabs tabs={[
                                            { text: "Yes, it's completely made up.", value: true },
                                            { text: "No, it's a real-life story.", value: false }
                                        ]} onChange={(option) => setIsFictional(option?.value)} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="font-semibold">2. Who is this story for?</label>
                                    <div className="mt-2 ml-4">
                                        <div>
                                            <STKAutocomplete
                                                placeholder="Filter by language"
                                                options={languages}
                                                optionLabel="name"
                                                color="aiMode"
                                                fluid
                                                onChange={(lang: any) => setLanguage(lang?.name) }/>
                                        </div>
                                        <div className="mt-2">
                                            <STKSelect
                                                fluid
                                                color="aiMode"
                                                placeholder="Filter by ages"
                                                options={allowedAgeGroups}
                                                enableSelectAll
                                                selectAllLabel="All ages"
                                                // @ts-ignore
                                                optionLabel="name"
                                                multiple
                                                onChange={(ages: any) => setAgeGroups(ages)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-2/3 pl-10 flex flex-col">
                                <label className="font-semibold">3. What is your story about?</label>
                                <div className="mt-2 ml-4">
                                    <STKTextField
                                        color="aiMode"
                                        fluid
                                        multiline
                                        onChange={(value) => setDescription(value)} />
                                    <div className="mt-2">
                                        <label className="text-sm">
                                            In 20 words or less, describe the setting and
                                            topic of your story. <br/>For example: &quot;A story about a magical tree&quot;
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-end flex-col mt-10">
                                    <STKButton
                                        color="aiMode"
                                        loading={loading}
                                        onClick={handleGenerateStoryIdeas}>
                                        Generate story ideas
                                    </STKButton>
                                    <div className="mt-2">
                                        <label className="text-sm">2 uses remaining</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </STKDialog>
    )
}
