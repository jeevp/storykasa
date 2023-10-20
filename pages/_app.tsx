import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import {useState} from "react";
import ProfileContext from "@/contexts/ProfileContext";
import AuthContext from "@/contexts/AuthContext";
import SnackbarContext from "@/contexts/SnackbarContext";

export default function App({ Component, pageProps }: AppProps) {
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
                <SnackbarContext.Provider
                // @ts-ignore
                value={{ snackbarBus, setSnackbarBus }}>
                    <Component {...pageProps} />
                </SnackbarContext.Provider>
            </ProfileContext.Provider>
        </AuthContext.Provider>
    )
}
