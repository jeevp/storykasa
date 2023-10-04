import {Avatar} from "@mui/material";
import {useEffect, useState} from "react";
import {green600} from "@/assets/colorPallet/colors";
import generateInitials from "@/utils/generateInitials";

interface STKAvatarProps {
    src?: string
    name?: string
}

export default function STKAvatar({ src, name }: STKAvatarProps) {
    const [initials, setInitials] = useState("")

    useEffect(() => {
        if (name) {
            setInitials(generateInitials(name))
        }
    }, [name]);
    return (
        <Avatar src={src} sx={{ bgcolor: green600 }}>
            {initials}
        </Avatar>
    )
}
