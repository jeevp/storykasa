import { Html, Head, Main, NextScript } from 'next/document'
import PendoScript from "@/tools/Pendo/PendoScript";
import GoogleAnalyticsScript from "@/tools/GoogleAnalytics/GoogleAnalyticsScript";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet" />
                <PendoScript />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
