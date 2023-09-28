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

      const id = localStorage.getItem('currentProfileID')
      if (id) {
        setCurrentProfileID(id)
      } else {
        router.push('/profiles')
      }
      setLoaded(true)
    }

    getAccountData()
  }, [])

  if (loaded) {
    return (
      <ProfileContext.Provider
        value={{ currentProfileID, setCurrentProfileID } as any}
      >
        {children}
      </ProfileContext.Provider>
    )
  } else {
    return <></>
  }
}
