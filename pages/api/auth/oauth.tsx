import { NextRequest, NextResponse } from 'next/server'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import supabaseService from "@/service/supabase";
// @ts-ignore
import Profile from "@/service/models/Profile";
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

        console.log(">>> OK 1 >>>>", { data })
        let defaultProfile = await Profile.getDefaultAccountProfile({
            accessToken: data.session.access_token
        })
        console.log(">>> OK 2 >>>>", { defaultProfile })

        if (!defaultProfile) {
            defaultProfile = await Profile.createProfile({
                name: data.session?.user?.user_metadata?.full_name,
                avatarUrl: data.session?.user?.user_metadata?.avatar_url
            })
        }
        console.log(">>> OK 3 >>>>")

        // @ts-ignore
        await supabaseService.auth.setSession({
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
        })
        console.log(">>> OK 4 >>>>")

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
