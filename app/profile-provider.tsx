'use client'

import { createContext, useEffect, useState } from 'react'
import { Profile } from '../lib/database-helpers.types'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const ProfileContext = createContext('')

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentProfileID, setCurrentProfileID] = useState<string>('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    console.log('profile provider!')
    const getAccountData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const { data: accounts } = await supabase.from('accounts').select()

      if (!session || !accounts) {
        console.log('no account, redirecting to login')
        router.push('/login')
      }
    }

    getAccountData()

    // declare the async data fetching function

    const id = localStorage.getItem('currentProfileID')
    if (id) {
      setCurrentProfileID(id)
    } else {
      router.push('/profiles')
    }
  }, [])

  return (
    <ProfileContext.Provider
      value={{ currentProfileID, setCurrentProfileID } as any}
    >
      {children}
    </ProfileContext.Provider>
  )
}
