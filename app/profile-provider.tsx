'use client'

import { createContext, useEffect, useState } from 'react'
import { Profile } from './database-helpers.types'
import { getProfiles } from './_actions'

const fakeProfile: Profile = {
  account_id: '',
  created_at: '',
  profile_id: '',
  profile_name: '',
}

export const ProfileContext = createContext('')

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentProfileID, setCurrentProfileID] = useState<string>()

  useEffect(() => {
    // declare the async data fetching function

    const id = localStorage.getItem('currentProfileID')
    if (id) {
      setCurrentProfileID(id)
    }

    // const loadProfiles = async () => {
    //   const profiles: Profile[] = await getProfiles()
    //   setCurrentProfile(profiles[0])
    // }
    // loadProfiles()
  }, [])

  return (
    <ProfileContext.Provider
      value={{ currentProfileID, setCurrentProfileID } as any}
    >
      {children}
    </ProfileContext.Provider>
  )
}
