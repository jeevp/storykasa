import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import STKLoading from "@/components/STKLoading/STKLoading";
import AuthHandler from "@/handlers/AuthHandler";
import {useRouter} from "next/router";

function OauthProcess() {
    const router = useRouter()

    useEffect(() => {
        const parsedQuery = queryString.parse(location.search);
        if (parsedQuery?.code) {
            authenticateOauth(parsedQuery?.code)
        }
    }, []);

    const authenticateOauth = async (code: string) => {
        await AuthHandler.authenticateOauth(code)
        await router.push("/")
    }

    return (
        <div className="flex items-center justify-center">
            <STKLoading />
        </div>
    )
}

export default OauthProcess;
