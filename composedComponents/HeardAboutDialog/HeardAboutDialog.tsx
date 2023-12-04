import STKDialog from "@/components/STKDialog/STKDialog";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import STkCheckbox from "@/components/STKCheckbox/STKCheckbox";
import {useState} from "react";
import STKTextField from "@/components/STKTextField/STKTextField";
import HeardAboutResearchHandler from "@/handlers/HeardAboutResearchHandler";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";

interface HeardAboutDialogProps {
    active: boolean
    onClose?: () => void
}

const FRIENDS_AND_FAMILY = "FRIENDS_AND_FAMILY"
const REFERRAL_IN_PROFESSIONAL_NETWORK = "REFERRAL_IN_PROFESSIONAL_NETWORK"
const SEARCH_ENGINE_WEBSITE_BLOD = "SEARCH_ENGINE_WEBSITE_BLOD"
const SOCIAL_MEDIA = "SOCIAL_MEDIA"
const FORUM_WORKSHOP_EVENT = "FORUM_WORKSHOP_EVENT"
const POSTER_FLYER = "POSTER_FLYER"
const OTHER = "OTHER"

const heardAboutOptions = [
    { label: "Friends and family", value: FRIENDS_AND_FAMILY },
    { label: "Referral in professional network", value: REFERRAL_IN_PROFESSIONAL_NETWORK },
    { label: "Search engine, website, blog", value: SEARCH_ENGINE_WEBSITE_BLOD },
    { label: "Social media", value: SOCIAL_MEDIA },
    { label: "Forum, workshop, event", value: FORUM_WORKSHOP_EVENT },
    { label: "Poster, flyer", value: POSTER_FLYER },
    { label: "Other (please specify)", value: OTHER }
]

export default function HeardAboutDialog({ active, onClose = () => ({}) }: HeardAboutDialogProps) {
    const { onMobile} = useDevice()
    const [selectedOptions, setSelectedOptions] = useState<Array<any>>([])
    const [loading, setLoading] = useState(false)
    const [otherText, setOtherText] = useState("")
    const { setSnackbarBus } = useSnackbar()
    // Methods
    const handleOptionOnChange = (selectedOption: any) => {
        const optionIncluded = selectedOptions.find((option) => option === selectedOption.value)
        if (optionIncluded) {
            setSelectedOptions(selectedOptions.filter((option) => option !== selectedOption.value))
        } else {
            // @ts-ignore
            setSelectedOptions([...selectedOptions, selectedOption.value])
        }
    }

    const handleSave = async () => {
        setLoading(true)
        await HeardAboutResearchHandler.create({
            sources: selectedOptions,
            otherSource: otherText
        })

        setLoading(false)
        setSnackbarBus({
            active: true,
            message: "Thanks for helping us to get to know you better!",
            type: "success"
        });

        onClose()
    }


    return (
        <STKDialog
            fullScreen={onMobile}
            maxWidth="xs"
            active={active}
            title="How did you hear about StoryKasa?"
            onClose={() => onClose()}>
            <div className="mt-8">
                <label className="font-semibold">Select all that apply</label>
                <div className="mt-4">
                    {heardAboutOptions.map((option, index) => (
                        <div className="first:mt-0 mt-2" key={index}>
                            <STkCheckbox onChange={() => handleOptionOnChange(option)}  />
                            <label>{option.label}</label>
                        </div>
                    ))}
                    {selectedOptions.includes(OTHER) && (
                        <div className="mt-4">
                            <STKTextField fluid={true}  onChange={(text) => setOtherText(text)}/>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <div>
                        <STKButton loading={loading} onClick={handleSave}>Save</STKButton>
                    </div>
                </div>
            </div>
        </STKDialog>
    )
}
