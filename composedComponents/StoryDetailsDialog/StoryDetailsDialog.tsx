import React from 'react';
import StoryDetails from "@/composedComponents/StoryDetails/StoryDetails";
import STKDialog from "@/components/STKDialog/STKDialog";
import Story from "@/models/Story";
import useDevice from "@/customHooks/useDevice";
import {useAuth} from "@/contexts/auth/AuthContext";
import STKButton from "@/components/STKButton/STKButton";
import {useRouter} from "next/router";
import { STK_ACCESS_TOKEN } from "@/config"


interface StoryDetailsDialogProps {
    open: boolean;
    story: Story | null;
    persist?: boolean;
    editionNotAllowed?: boolean;
    onClose?: () => void;
}

export default function StoryDetailsDialog({
    open,
    editionNotAllowed,
    story,
    persist,
    onClose = () => ({}),
}: StoryDetailsDialogProps) {
    const { onMobile } = useDevice()
    const router = useRouter()
    const { currentUser, setCurrentUser } = useAuth()

    const handleSignUp = async () => {
        await router.push("signup")
        localStorage.removeItem(STK_ACCESS_TOKEN)
        setCurrentUser(null)
    }


    return (
        <STKDialog
        fullScreen={onMobile}
        active={open}
        persist={persist}
        onClose={() => onClose()}>
            <StoryDetails
            editionNotAllowed={editionNotAllowed}
            story={story} />
            {currentUser?.isGuest ? (
                <div className="mt-4">
                    <STKButton onClick={handleSignUp}>Sign up to continue exploring stories</STKButton>
                </div>
            ) : null}
        </STKDialog>
    )
}
