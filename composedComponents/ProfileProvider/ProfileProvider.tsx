import {createContext, useContext, useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ProfileContext from "@/contexts/ProfileContext";

export default function ProfileProvider({ children }: {
    children: React.ReactNode
}) {
    const { currentProfileId } = useContext(ProfileContext)

    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

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
