import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { STK_ACCESS_TOKEN } from '@/config'
import {useAuth} from "@/contexts/auth/AuthContext";

const withoutAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { currentUser } = useAuth()
    const router = useRouter()
    const [isValidationComplete, setIsValidationComplete] = useState(false)

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem(STK_ACCESS_TOKEN)

        if (accessToken || currentUser) {
          router.push('/discover')
        } else {
          setIsValidationComplete(true)
        }
      }
    }, [])

    return isValidationComplete ? <WrappedComponent {...props} /> : null
  }
}

export default withoutAuth
