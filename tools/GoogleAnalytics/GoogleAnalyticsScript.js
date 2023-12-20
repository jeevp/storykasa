import Script from "next/script";

function GoogleAnalyticsScript() {
    const GA_TRACKING_ID = 'G-LTEVQ6F6XH';

    return (
        <>
            {/* Async load the Google Analytics script */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="afterInteractive"
                async
            />

            {/* Initialize Google Analytics */}
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}');
                    `,
                }}
            />
        </>
    );
}

export default GoogleAnalyticsScript;
