import STKDialog from "@/components/STKDialog/STKDialog";
import {useEffect, useState} from "react";
import useDevice from "@/customHooks/useDevice";
import {purple600} from "@/assets/colorPallet/colors";
import AIStoryIdeaList from "@/composedComponents/AIStoryGenerator/AIStoryIdeaList";
import {useProfile} from "@/contexts/profile/ProfileContext";
import StoryIdeasHandler from "@/handlers/StoryIdeasHandler";
import STKButton from "@/components/STKButton/STKButton";


interface AIStoryGeneratorDialogProps {
    active: boolean,
    onSelect: (story: any) => void
    onClose: () => void
}

export default function StoryIdeasHistory({
   active,
   onSelect = () => ({}),
   onClose = () => ({})
}: AIStoryGeneratorDialogProps) {
    const { onMobile } = useDevice()
    const { currentProfileId } = useProfile()

    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [language, setLanguage] = useState("")
    const [ageGroups, setAgeGroups] = useState([])
    const [storyIdeas, setStoryIdeas] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalStoryIdeas, setTotalStoryIdeas] = useState(null)

    // Mounted
    useEffect(() => {
        if (active) {
            setLoading(true)
            handleFetchStoryIdeas()
        }
    }, [active]);


    // Methods
    const handleStoryOnSelect = (storyIdea: any) => {
        onSelect({
            id: storyIdea.id,
            title: storyIdea.title,
            language: "English",
            ageGroups: storyIdea?.ageGroups,
            firstLine: storyIdea.firstLine,
            setting: storyIdea.setting,
            characters: storyIdea?.characters
        })

        onClose()
    }

    const handleFetchStoryIdeas = async (options = { page: 1 }) => {
        const response = await StoryIdeasHandler.fetchStoryIdeas({
            profileId: currentProfileId,
            page: options.page
        })
        if (response.totalStoryIdeas !== totalStoryIdeas) setTotalStoryIdeas(response.totalStoryIdeas)
        if (response.totalPages !== totalPages) setTotalPages(response.totalPages)

        const updatedStoryIdeas = [...storyIdeas]
        response.storyIdeas.forEach((storyIdea: any) => {
            // @ts-ignore
            const storyAlreadyInTheList = updatedStoryIdeas.find((_storyIdea) => _storyIdea.id === storyIdea.id)

            if (!storyAlreadyInTheList) {
                // @ts-ignore
                updatedStoryIdeas.push(storyIdea)
            }
        })

        setStoryIdeas(updatedStoryIdeas)
        setCurrentPage(options.page)
        setLoading(false)
    }

    const handleFetchMoreStoryIdeas = async () => {
        const nextPage = currentPage + 1
        if (nextPage > totalPages) return

        setLoadingMore(true)
        await handleFetchStoryIdeas({ page: nextPage })
        setCurrentPage(nextPage)
        setLoadingMore(false)
    }

    const handleClose = () => {
        onClose()
        setTimeout(() => {
            setStoryIdeas([])
            setCurrentPage(1)
            setTotalPages(1)
        }, 1000)
    }


    return (
        <STKDialog
            active={active}
            fullScreen={onMobile}
            title="Story ideas history"
            titleColor={purple600}
            maxWidth="md"
            aiMode
            onClose={handleClose}>
            <div className="mt-4">
                {!loading && (
                    <div><span className="font-semibold">{totalStoryIdeas}</span> story ideas</div>
                )}
                <div className="mt-4">
                    <AIStoryIdeaList loading={loading} storyIdeas={storyIdeas} onSelect={handleStoryOnSelect} />
                    {totalPages > 1 && currentPage < totalPages && (
                        <div className="mt-4 flex justify-center">
                            <STKButton slim onClick={handleFetchMoreStoryIdeas} loading={loadingMore}>
                                Show more
                            </STKButton>
                        </div>
                    )}
                </div>
            </div>
        </STKDialog>
    )
}
