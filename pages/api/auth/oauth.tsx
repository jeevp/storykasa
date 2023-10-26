import { NextRequest, NextResponse } from 'next/server'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const processOauth = async (req: NextRequest, res: NextResponse) => {
    try {
        const { code } = req.body

        if (!code) return res.status(400).send({ message: "Code is missing." })

        const supabase = createPagesServerClient({ req, res })
        const response = await supabase.auth.exchangeCodeForSession(String(code))
        return res.status(201).send({ message: "Authentication succeed." , response })

    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}


export default processOauth
