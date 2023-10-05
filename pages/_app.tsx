import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import {useState} from "react";
import ProfileContext from "@/contexts/ProfileContext";
import AuthContext from "@/contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
    const [currentProfileId, setCurrentProfileId] = useState<string>('')
    const [currentUser, setCurrentUser] = useState<any>(null)

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            <ProfileContext.Provider
                value={{ currentProfileId, setCurrentProfileId }}
            >
                <Component {...pageProps} />
            </ProfileContext.Provider>
        </AuthContext.Provider>
    )
}