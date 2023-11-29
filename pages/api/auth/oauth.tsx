import { NextRequest, NextResponse } from 'next/server'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import supabaseService from "@/service/supabase";
// @ts-ignore
import ProfileServiceHandler from "@/service/handlers/ProfileServiceHandler";
//
const processOauth = async (req: NextRequest, res: NextResponse) => {
    try {
        // @ts-ignore
        const { code } = req.body
        // @ts-ignore
        if (!code) return res.status(400).send({ message: "Code is missing." })
        // @ts-ignore
        const supabase = createPagesServerClient({ req, res })
        const { data, error } = await supabase.auth.exchangeCodeForSession(String(code))

        if (error) {
            // @ts-ignore
            return res.status(400).send({ message: "Something went wrong" })
        }

        const defaultProfile = await ProfileServiceHandler.getDefaultAccountProfile({
            accessToken: data.session.access_token
        })

        // @ts-ignore
        await supabaseService.auth.setSession({
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
        })

        // @ts-ignore
        return res.status(200).send({
            ...data,
            defaultProfile
        })
    } catch (error) {
        console.error(error)
        // @ts-ignore
        return res.status(400).send(error)
    }
}


export default processOauth
