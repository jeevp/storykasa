import { NextRequest, NextResponse } from 'next/server'

import axios from "axios";

const requestPasswordRecovery = async (req: NextRequest, res: NextResponse) => {
    try {
        const { code } = req.body

        if (code) {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token`,
                {},
                {
                    params: {
                        grant_type: "authorization_code",
                        code,
                        redirect_uri: req.headers.host,
                        client_id: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                        client_secret: process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY

                    },
                    headers: {
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            console.log(response.data)
        }

        return res.status(201).send({ message: "Authentication succeed." })
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}


export default requestPasswordRecovery
