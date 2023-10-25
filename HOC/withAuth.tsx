import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext'
import decodeJWT from '@/utils/decodeJWT'
import jwtDecode from 'jwt-decode' // Import jwt-decode to validate tokens
import { STK_ACCESS_TOKEN, STK_REFRESH_TOKEN } from '@/config'
import AuthHandler from '@/handlers/AuthHandler'

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { setCurrentUser } = useContext(AuthContext)
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
      setCurrentUser(user)
      console.log(user)
      setHasToken(true)
      document.cookie = `loggedIn=true;domain=.storykasa.com;path=/`
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
          document.cookie = `loggedIn=false;domain=.storykasa.com;path=/`
          handleSignOut()
          return
        }

        handleLogin(accessToken)
      }
    }, [])

    if (!hasToken) return null

    return (
      <>
        <WrappedComponent {...props} />
      </>
    )
  }
}

export default withAuth
