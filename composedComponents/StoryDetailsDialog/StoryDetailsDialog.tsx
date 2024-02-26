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
                <div className="mt-4 w-full flex flex-col lg:flex-row justify-end items-center">
                    <div className={"w-full lg:w-auto"}>
                        <STKButton fullWidth={onMobile} onClick={handleSignUp}>Sign up to continue exploring stories</STKButton>
                    </div>
                    <div className="lg:ml-2 w-full lg:w-auto lg:mt-0 mt-2 ml-0">
                        <a href="https://storykasa.com">
                            <STKButton fullWidth={onMobile} variant="outlined">Learn more about StoryKasa</STKButton>
                        </a>
                    </div>
                </div>

            ) : null}
        </STKDialog>
    )
}
