import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext'
import decodeJWT from "@/utils/decodeJWT"
import jwtDecode from 'jwt-decode'  // Import jwt-decode to validate tokens
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from "@/config"

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const { setCurrentUser } = useContext(AuthContext)
        const router = useRouter()
        const [hasToken, setHasToken] = useState(false);

        const isTokenExpired = (token) => {
            const decodedToken = jwtDecode(token);
            const expirationTime = decodedToken.exp * 1000;  // Convert to milliseconds
            return expirationTime <= Date.now();
        }

        const handleLogin = (accessToken: string) => {
            const user = decodeJWT(accessToken)
            setCurrentUser(user)
            setHasToken(true);
        }

        const refreshTokens = async (refreshToken: string) => {
            // try {
            //     const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/token`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         },
            //         body: new URLSearchParams({
            //             grant_type: 'refresh_token',
            //             refresh_token: refreshToken,
            //         }),
            //     });
            //
            //     if (!response.ok) {
            //         throw new Error('Failed to refresh token');
            //     }
            //
            //     const data = await response.json();
            //     handleLogin(data.access_token);
            // } catch (error) {
            //     console.error('Error refreshing token:', error);
            //     router.push('/');
            // }
        }

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem(STK_ACCESS_TOKEN);
                const refreshToken = localStorage.getItem(STK_REFRESH_TOKEN);

                if (accessToken && isTokenExpired(accessToken) && refreshToken) {
                    refreshTokens(refreshToken);
                    return;
                } else if (!accessToken || isTokenExpired(accessToken)) {
                    router.push('/');
                    return;
                }

                handleLogin(accessToken);
            }
        }, []);

        if (!hasToken) return null;

        return <WrappedComponent {...props} />
    }
}

export default withAuth;
