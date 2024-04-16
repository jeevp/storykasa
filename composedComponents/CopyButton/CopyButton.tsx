import STKButton from "@/components/STKButton/STKButton";
import React, {useState} from "react";

export default function CopyButton({ text }: { text: string }) {
    const [isCouponCopied, setIsCouponCopied] = useState(false);

    const copyToClipboard = async (code: string) => {
        if (!navigator.clipboard) {
            console.error("Clipboard not available");
            return;
        }

        await navigator.clipboard.writeText(text);
        setIsCouponCopied(true);
        setTimeout(() => {
            setIsCouponCopied(false)
        }, 1000)
    };

    return (
        <STKButton onClick={copyToClipboard}>
            {isCouponCopied ? "Copied" : "Copy Code"}
        </STKButton>
    )
}
