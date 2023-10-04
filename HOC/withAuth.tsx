import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import AuthContext from '@/contexts/AuthContext'
import decodeJWT from "@/utils/decodeJWT"
import {STK_ACCESS_TOKEN} from "@/config"

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const { setCurrentUser } = useContext(AuthContext)
        const router = useRouter()

        const handleLogin = (accessToken: string) => {
            const user = decodeJWT(accessToken)
            setCurrentUser(user)
        }

        // @ts-ignore
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem(STK_ACCESS_TOKEN)
                if (!accessToken) {
                    router.push('/')
                    return null
                }

                handleLogin(accessToken);
            }
        }, [])

        return <WrappedComponent {...props} />
    }
}

export default withAuth;
