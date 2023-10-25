import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext'
import { STK_ACCESS_TOKEN } from '@/config'

const withoutAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter()
    const [isValidationComplete, setIsValidationComplete] = useState(false)

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(STK_ACCESS_TOKEN)

        if (accessToken || currentUser) {
          router.push('/library')
        } else {
          document.cookie = `loggedIn=false;domain=.storykasa.com;path=/`
          setIsValidationComplete(true)
        }
      }
    }, [])

    return isValidationComplete ? <WrappedComponent {...props} /> : null
  }
}

export default withoutAuth
