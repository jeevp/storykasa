import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

interface ValidateSessionProps {
    children: any
}

export default async function ValidateSession({ children }: ValidateSessionProps) {
    const supabase = createServerComponentClient<Database>({
        cookies,
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (session) {
        redirect('/library')
    }

    return children
}
