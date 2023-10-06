import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import {Avatar} from "@mui/material";
import {PencilSimple} from "@phosphor-icons/react";

interface ProfileCardProps {
    managing: boolean
    avatarURL?: string
    name: string
    onEdit: () => void
    onSelect: () => void
}

export default function ProfileCard({
    managing,
    avatarURL,
    name,
    onEdit = () => ({}),
    onSelect = () => ({})
}: ProfileCardProps) {
    const handleEdit = (e: Event) => {
        e.stopPropagation()
        onEdit()
    }


    return (
        <STKCard>
            <div className="flex flex-col items-center p-6 lg:w-56 h-52 cursor-pointer" onClick={() => onSelect()}>
                <div className="flex flex-col items-center justify-center relative">
                    <Avatar src={avatarURL} sx={{ width: 80, height: 80 }} />
                    <div className="flex items-center mt-2">
                        <label className="font-bold">
                            {name}
                        </label>
                    </div>
                </div>
                {managing && (
                    <div className="mt-4">
                        <STKButton
                            onClick={handleEdit}
                            variant="outlined"
                            rounded
                            slim
                            startIcon={<PencilSimple size={16} weight="bold" />}
                        >
                            Edit
                        </STKButton>
                    </div>
                )}
            </div>
        </STKCard>
    )
}
