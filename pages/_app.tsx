import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import ContextWrapper from "@/contexts/ContextWrapper";
import GoogleAnalyticsScript from "@/tools/GoogleAnalytics/GoogleAnalyticsScript";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ContextWrapper>
            <GoogleAnalyticsScript />
            <Component {...pageProps} />
        </ContextWrapper>
    )
}
