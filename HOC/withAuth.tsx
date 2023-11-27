import { useRouter } from 'next/router'
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
    const { setCurrentUser, setCurrentUserIsAdmin } = useAuth()
    const { pendoTrackingEnabled, setPendoTrackingEnabled } = useTools()

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

      if (!pendoTrackingEnabled) {
        identifyPendoVisitor({ userId: user.sub })
        setPendoTrackingEnabled(true)
      }
    }

    const handleSignOut = async () => {
      await AuthHandler.signOut()
      await router.push('/login')
    }

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(STK_ACCESS_TOKEN)
        const refreshToken = localStorage.getItem(STK_REFRESH_TOKEN)

        if (
          (accessToken && isTokenExpired(accessToken) && refreshToken) ||
          !accessToken ||
          isTokenExpired(accessToken)
        ) {
          handleSignOut()
          return
        }

        document.cookie = `loggedIn=true;domain=.storykasa.com;path=/`
        handleLogin(accessToken)
      }
    }, [])

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
