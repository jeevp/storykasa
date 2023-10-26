import React, { useEffect } from 'react';
import queryString from 'query-string';
import STKLoading from "@/components/STKLoading/STKLoading";
import {useRouter} from "next/router";
import AuthHandler from "@/handlers/AuthHandler";
import Image from "next/image";

function OauthProcess() {
    const router = useRouter()

    useEffect(() => {
        const parsedQuery = queryString.parse(location.search);
        if (parsedQuery?.code) {
            // @ts-ignore
            authenticateOauth(parsedQuery?.code)
        }
    }, []);

    const authenticateOauth = async (code: string) => {
        try {
            await AuthHandler.authenticateOauth(code)
            await router.push("/library")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex items-center flex-col justify-center" style={{ height: "100vh" }}>
            <Image
                src="/logo.svg"
                width={0}
                className="cursor-pointer h-auto"
                height={0}
                style={{ width: 280 }}
                alt="StoryKasa logo"
            />
            <div className="mt-10">
                <STKLoading />
            </div>
        </div>
    )
}

export default OauthProcess;
