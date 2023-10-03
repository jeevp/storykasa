import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import {useState} from "react";
import ProfileContext from "@/contexts/ProfileContext";

export default function App({ Component, pageProps }: AppProps) {
    const [currentProfileId, setCurrentProfileId] = useState<string>('')

    return (
        <ProfileContext.Provider
            value={{ currentProfileId, setCurrentProfileId }}
        >
            <Component {...pageProps} />
        </ProfileContext.Provider>
    )
}
