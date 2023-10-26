import React, { useEffect } from 'react';
import queryString from 'query-string';
import STKLoading from "@/components/STKLoading/STKLoading";
import {useRouter} from "next/router";
import supabase from "../../service/supabase"
import AuthHandler from "@/handlers/AuthHandler";

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
            await router.push("/")
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex items-center justify-center">
            <STKLoading />
        </div>
    )
}

export default OauthProcess;
