import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import decodeJWT from '@/utils/decodeJWT'
import jwtDecode from 'jwt-decode'
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from '@/config'
import AuthHandler from '@/handlers/AuthHandler'
import identifyPendoVisitor from "@/tools/Pendo/identifyPendoVisitor";
import {useAuth} from "@/contexts/auth/AuthContext";
import {useTools} from "@/contexts/tools/ToolsContext";
import { allowedAdminUsers } from "@/service/config"

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { currentUser, setCurrentUser, setCurrentUserIsAdmin } = useAuth()
    const { pendoTrackingEnabled, setPendoTrackingEnabled } = useTools()
    const searchParams = useSearchParams()

    const router = useRouter()
    const [hasToken, setHasToken] = useState(false)

    const isTokenExpired = (token: string) => {
      const decodedToken = jwtDecode(token)
      // @ts-ignore
      const expirationTime = decodedToken.exp * 1000 // Convert to milliseconds
      return expirationTime <= Date.now()
    }

    const handleLogin = (accessToken: string) => {
      const user = decodeJWT(accessToken)
      const _currentUserIsAdmin = allowedAdminUsers.includes(user.email)
      setCurrentUserIsAdmin(_currentUserIsAdmin)

      setCurrentUser(user)
      setHasToken(true)

      if (user?.isGuest) {
        localStorage.setItem(STK_ACCESS_TOKEN, accessToken)
      }

      if (!pendoTrackingEnabled && !user?.isGuest) {
        identifyPendoVisitor({ userId: user.sub })
        setPendoTrackingEnabled(true)
      }
    }

    const handleSignOut = async () => {
      console.log(">>> SIGN OUT", { currentUser })
      await AuthHandler.signOut()
      await router.push('/login')
    }

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(STK_ACCESS_TOKEN)
        const refreshToken = localStorage.getItem(STK_REFRESH_TOKEN)
        const guestAccessToken  = searchParams?.get("guestAccessToken")

        if (guestAccessToken) {
          document.cookie = `loggedIn=true;domain=.storykasa.com;path=/`
          handleLogin(guestAccessToken)
          return
        }

        if (
          (accessToken && isTokenExpired(accessToken) && refreshToken && !currentUser?.isGuest) ||
            (!accessToken && !currentUser?.isGuest) ||
            // @ts-ignore
            isTokenExpired(accessToken) && !currentUser?.isGuest
        ) {
          handleSignOut()
          return
        }

        document.cookie = `loggedIn=true;domain=.storykasa.com;path=/`
        // @ts-ignore
        handleLogin(accessToken)
      }
    }, [searchParams])

    if (!hasToken) {
      return null
    }

    return (
      <>
        <WrappedComponent {...props} />
      </>
    )
  }
}

export default withAuth
