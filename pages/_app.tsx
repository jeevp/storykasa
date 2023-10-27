import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import {useState} from "react";
import ProfileContext from "@/contexts/ProfileContext";
import AuthContext from "@/contexts/AuthContext";
import SnackbarContext from "@/contexts/SnackbarContext";
import ToolsContext from "@/contexts/ToolsContext";

export default function App({ Component, pageProps }: AppProps) {
    const [pendoTrackingEnabled, setPendoTrackingEnabled] = useState<boolean>(false)
    const [currentProfileId, setCurrentProfileId] = useState<string | null>('')
    const [currentProfile, setCurrentProfile] = useState<object | null>(null)
    const [snackbarBus, setSnackbarBus] = useState<object>({
        active: false,
        message: "",
        type: ""
    })

    const [currentUser, setCurrentUser] = useState<any>(null)

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            <ProfileContext.Provider
                value={{
                    currentProfileId,
                    setCurrentProfileId,
                    currentProfile,
                    setCurrentProfile
            }}
            >
                <ToolsContext.Provider value={{ pendoTrackingEnabled, setPendoTrackingEnabled }}>
                    <SnackbarContext.Provider
                        // @ts-ignore
                        value={{ snackbarBus, setSnackbarBus }}>
                        <Component {...pageProps} />
                    </SnackbarContext.Provider>
                </ToolsContext.Provider>
            </ProfileContext.Provider>
        </AuthContext.Provider>
    )
}
