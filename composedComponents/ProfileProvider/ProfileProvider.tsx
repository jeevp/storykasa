import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import supabase from "../../service/supabase"
import {useProfile} from "@/contexts/profile/ProfileContext";

export default function ProfileProvider({ children }: {
    children: React.ReactNode
}) {
    const { currentProfileId } = useProfile()

    const router = useRouter()

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const getAccountData = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            const { data: accounts } = await supabase.from('accounts').select()

            if (!session || !accounts) {
                router.push('/login')
            }
            // declare the async data fetching function

            if (!currentProfileId) {
                router.push('/profiles')
            }

            setLoaded(true)
        }

        getAccountData()
    }, [])

    if (loaded) {
        return (
            <div>
                {children}
            </div>
        )
    } else {
        return <></>
    }
}
