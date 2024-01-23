import type { AppProps } from 'next/app'
import "../app/styles/globals.css";
import ContextWrapper from "@/contexts/ContextWrapper";
import GoogleAnalyticsScript from "@/tools/GoogleAnalytics/GoogleAnalyticsScript";
import SubscriptionValidation from "@/composedComponents/SubscriptionValidation/SubscriptionValidation";

export default function App({ Component, pageProps }: AppProps) {


    return (
        <ContextWrapper>
            <SubscriptionValidation />
            <GoogleAnalyticsScript />
            <Component {...pageProps} />
        </ContextWrapper>
    )
}
