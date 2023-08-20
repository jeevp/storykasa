'use client'

import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Text,
} from '@radix-ui/themes'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { ProfileContext } from '../profile-provider'
import { getProfiles } from '../../lib/_actions'
import { Profile } from '../../lib/database-helpers.types'
import { usePathname } from 'next/navigation'
import { BookOpenText, Books, Microphone } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Nav() {
  const pathname = usePathname()

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

  const handleProfileChange = (profileID: any) => {
    setCurrentProfileID(profileID)
    localStorage.setItem('currentProfileID', profileID)
  }

  useEffect(() => {
    loadProfiles()
  }, [currentProfileID])

  return (
    <nav>
      {currentProfile && (
        <AnimatePresence mode="wait">
          (
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            key={currentProfile.profile_id}
          >
            <Heading size="6">Hi, {currentProfile.profile_name}!</Heading>
          </motion.div>
        </AnimatePresence>
      )}
      {/* {currentProfile && (
        <Select.Root
          size="3"
          value={currentProfile.profile_id}
          onValueChange={handleProfileChange}
        >
          <Select.Trigger variant="soft" />
          <Select.Content>
            {profileOptions.map((profile: Profile) => (
              <Select.Item value={profile.profile_id} key={profile.profile_id}>
                <Flex direction="row" align="center">
                  <Avatar
                    fallback={initials(profile.profile_name)}
                    size="1"
                    mr="3"
                  ></Avatar>
                  <Text weight="medium" size="2">
                    {profile.profile_name}
                  </Text>
                </Flex>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )} */}

      <Flex direction="column" gap="3">
        <Text size="5" weight="bold" mb="3">
          {' '}
        </Text>

        <Link href="/discover" passHref legacyBehavior>
          <a
            role="button"
            href="/discover"
            className={
              pathname == '/discover' ? 'select-btn active' : 'select-btn'
            }
          >
            <Flex direction="row" gap="2">
              <BookOpenText size={24} weight="duotone" />
              Discover
            </Flex>
          </a>
        </Link>

        <Link href="/library" passHref legacyBehavior>
          <a
            role="button"
            href="/library"
            className={
              pathname == '/library' ? 'select-btn active' : 'select-btn'
            }
          >
            <Flex direction="row" gap="2">
              <Books size={24} weight="duotone" />
              Library
            </Flex>
          </a>
        </Link>

        <Link href="/record" passHref legacyBehavior>
          <a
            role="button"
            href="/record"
            className={
              pathname == '/record' ? 'raised-btn active' : 'raised-btn'
            }
            style={{ marginTop: '3em' }}
          >
            <Flex direction="row" gap="2">
              <Microphone size={24} weight="duotone" />
              Record a story
            </Flex>
          </a>
        </Link>
      </Flex>
    </nav>
  )
}
