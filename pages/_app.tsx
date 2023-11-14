import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import ContextWrapper from "@/contexts/ContextWrapper";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ContextWrapper>
            <Component {...pageProps} />
        </ContextWrapper>
    )
}
