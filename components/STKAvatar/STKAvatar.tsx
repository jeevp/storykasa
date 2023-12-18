import {Avatar} from "@mui/material";
import {useEffect, useState} from "react";
import generateInitials from "@/utils/generateInitials";
import defaultAvatar from "@/assets/images/default-avatar.jpg"
import {green600} from "@/assets/colorPallet/colors";
interface STKAvatarProps {
    src?: string
    name?: string
    size?: number
}


export default function STKAvatar({ src = "/broken-image.jpg", name, size }: STKAvatarProps) {
    const [initials, setInitials] = useState("")

    useEffect(() => {
        if (name) {
            setInitials(generateInitials(name))
        }
    }, [name]);
    return (
        <Avatar src={src} sx={{ width: size, height: size, border: name ? green600 : "1px solid #777" }}>
            {name ? initials : null}
        </Avatar>
    )
}
