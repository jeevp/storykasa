import Image from 'next/image'
import {Divider} from "@mui/material";
import AccountDetails from "@/composedComponents/AccountDetails/AccountDetails";
import {useRouter} from "next/router";
import {useAuth} from "@/contexts/auth/AuthContext";
import STKButton from "@/components/STKButton/STKButton";
import {Question} from "@phosphor-icons/react";
import React, {useState} from "react";
import HelperDialog from "@/composedComponents/HelperDialog/HelperDialog";

export default function Navbar() {
    const { currentUser } = useAuth()
    const router = useRouter()

    // States
    const [showHelperDialog, setShowHelperDialog] = useState(false)

    const goToRoot = async () => {
       await router.push("/")
    }

    return (
        <div>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Image
                        src="/logo.svg"
                        width={0}
                        className="cursor-pointer h-auto"
                        height={0}
                        style={{ width: 150 }}
                        alt="StoryKasa logo"
                        onClick={goToRoot}
                    />
                    {currentUser && (
                        <div className="ml-2">
                            <STKButton
                            iconButton
                            variant="outlined"
                            color="primary"
                            onClick={() => setShowHelperDialog(true)}>
                                <Question />
                            </STKButton>
                        </div>
                    )}
                </div>
                {currentUser && <AccountDetails />}
            </div>
            <div className="mt-4">
                <Divider />
            </div>
            <HelperDialog active={showHelperDialog} onClose={() => setShowHelperDialog(false)} />
        </div>
    )
}
