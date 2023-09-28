'use client'

import {
  Heading,
} from '@radix-ui/themes'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { ProfileContext } from '../profile-provider'
import { getProfiles } from '../../lib/_actions'
import { Profile } from '../../lib/database-helpers.types'
import { usePathname } from 'next/navigation'
import { BookOpenText, Books, Microphone } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import useDevice from "@/app/customHooks/useDevice";

export default function Nav() {
  const pathname = usePathname()
  const { onMobile } = useDevice()

  const { currentProfileID, setCurrentProfileID } = useContext(
    ProfileContext
  ) as any

  const [profileOptions, setProfileOptions] = useState<Profile[]>([])

  const loadProfiles = async () => {
    const profiles: Profile[] = await getProfiles()
    setProfileOptions(profiles)
  }

  const currentProfile = profileOptions.find(
    (p) => p.profile_id === currentProfileID
  )

  useEffect(() => {
    loadProfiles()
  }, [currentProfileID])

  return (
    <nav>
      {currentProfile && (
        <AnimatePresence mode="wait">
          (
          <motion.div
            initial={{ x: onMobile ? 0 : 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            key={currentProfile.profile_id}
          >
            <Heading size="4">Hi, {currentProfile.profile_name}!</Heading>

            <div
              className="nav lg:mt-8 w-full lg:w-auto flex lg:flex-col bg-white lg:bg-transparent justify-center py-6 px-6 lg:p-0 left-0 lg:left-auto fixed z-10 lg:relative bottom-0 lg:bottom-auto">
              <Link href="/discover" passHref legacyBehavior>
                <a
                  role="button"
                  title="Discover new publicly available stories"
                  href="/discover"
                  className={`h-12 lg:h-auto ${pathname === "/discover" ? 'select-btn active' : 'select-btn'}`}
                >
                  <div className="flex items-center">
                    <BookOpenText size={24} weight="duotone" />
                    <span className="ml-2 hidden lg:block">Discover</span>
                  </div>
                </a>
              </Link>

              <Link href="/library" passHref legacyBehavior>
                <a
                  role="button"
                  title="Listen to the stories in your library"
                  href="/library"
                  className={`h-12 lg:h-auto ml-4 lg:mt-4 lg:ml-0 ${pathname === "/library" ? 'select-btn active' : 'select-btn'}`}
                >
                  <div className="flex">
                    <Books size={24} weight="duotone" />
                    <span className="ml-2 hidden lg:block">
                        My library
                    </span>
                  </div>
                </a>
              </Link>

              <Link href="/record" passHref legacyBehavior>
                <a
                  role="button"
                  title="Record and add a new story"
                  href="/record"
                  className={`h-12 lg:h-auto lg:mt-8 mt-0 ml-4 lg:ml-0 ${pathname === "/record" ? 'raised-btn active' : 'raised-btn'}`}
                >
                  <div className="flex">
                    <Microphone size={24} weight="duotone" />
                    <span className="ml-2 hidden lg:block">
                    Add a story
                    </span>
                  </div>
                </a>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </nav>
  )
}
