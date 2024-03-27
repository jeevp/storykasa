import STKAccordion from "@/components/STKAccordion/STKAccordion";
import STKButton from "@/components/STKButton/STKButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface AIStoryIdeaListProps {
    storyIdeas: any[],
    expandFirstItem?: boolean
    onSelect: (storyIdea: any) => void
}

export default function AIStoryIdeaList({
    storyIdeas,
    expandFirstItem = false,
    onSelect = () => ({})
}: AIStoryIdeaListProps) {
    return (
        <div>
            {storyIdeas?.map((storyIdea: any, index: number) => (
                <div key={index} className="first:mt-0 mt-2">
                    <STKAccordion
                        // @ts-ignore
                        titlePrefix={`Idea ${index + 1}`}
                        title={`"${storyIdea?.title}"`}
                        titleSize="text-lg"
                        defaultExpanded={expandFirstItem ? index === 0 : null}>
                        <p>{storyIdea?.setting}</p>
                        <div className="mt-4">
                            <label className="font-semibold">Characters</label>
                            <ul>
                                {storyIdea?.characters?.map((character: string, _index: number) => (
                                    <li key={_index}>
                                        <span
                                        // @ts-ignore
                                        className="font-semibold">{character?.name}</span>: {character?.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold">First line</label>
                            <p className="mt-2">{storyIdea?.firstLine}</p>
                        </div>
                        <div className="mt-8">
                            <STKButton
                                startIcon={<CheckCircleOutlineIcon />}
                                onClick={() => onSelect(storyIdea)}>
                                Use this idea
                            </STKButton>
                        </div>
                    </STKAccordion>
                </div>
            ))}
        </div>
    )
}
