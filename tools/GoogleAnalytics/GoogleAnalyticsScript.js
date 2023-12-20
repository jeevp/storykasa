import Head from "next/head"

function GoogleAnalyticsScript() {
    const GA_TRACKING_ID = 'G-LTEVQ6F6XH';

    return (
        <Head>
            <script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                async
            />

            <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}');
                    `,
                }}
            />
        </Head>
    );
}

export default GoogleAnalyticsScript;
