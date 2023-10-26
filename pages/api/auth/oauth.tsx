import { NextRequest, NextResponse } from 'next/server'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const processOauth = async (req: NextRequest, res: NextResponse) => {
    try {
        // @ts-ignore
        const { code } = req.body
        // @ts-ignore
        if (!code) return res.status(400).send({ message: "Code is missing." })
        // @ts-ignore
        const supabase = createPagesServerClient({ req, res })
        const response = await supabase.auth.exchangeCodeForSession(String(code))
        // @ts-ignore
        return res.status(201).send({ message: "Authentication succeed." , response })

    } catch (error) {
        console.error(error)
        // @ts-ignore
        return res.status(400).send({ message: "Something went wrong." })
    }
}


export default processOauth
