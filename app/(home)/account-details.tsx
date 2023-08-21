'use client'

import { Account, Profile } from '@/lib/database-helpers.types'
import { initials } from '@/lib/utils'
import { UserSwitch, SignOut, CaretDown } from '@phosphor-icons/react'
import { Flex, Text, Avatar, Button, Box, DropdownMenu } from '@radix-ui/themes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProfileContext } from '../profile-provider'

import HelpDialog from '../help-dialog'
import { useContext, useEffect, useState } from 'react'
import { getProfiles } from '@/lib/_actions'

export default function AccountDetails({ account }: { account: Account }) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

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

  const handleSignOut = async () => {
    localStorage.removeItem('currentProfileID')
    await supabase.auth.signOut()

    router.refresh()
    router.push('/')
  }

  return (
    <Flex direction="row" align="center" gap="5">
      <HelpDialog></HelpDialog>
      {currentProfile && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost">
              <Avatar
                src={currentProfile.avatar_url as string}
                size="3"
                fallback={initials(currentProfile.profile_name)}
                radius="full"
              ></Avatar>
              <CaretDown size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild>
              <a href="/profiles">
                <UserSwitch size={20} />{' '}
                <Text weight="regular" ml="2">
                  Change profiles
                </Text>
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <Flex
              direction="row"
              gap="1"
              align="center"
              p="3"
              justify="between"
            >
              <Avatar
                src={account.avatar_url}
                size="2"
                fallback={initials(account.name)}
                radius="full"
              ></Avatar>
              <Flex direction="column" gap="0" style={{ maxWidth: 200 }}>
                <Text weight="regular" size="1">
                  Account name
                </Text>
                <Text weight="medium" size="2">
                  {account.name}
                </Text>
              </Flex>
            </Flex>
            <DropdownMenu.Item asChild>
              <a onClick={handleSignOut}>
                <SignOut size={20} />{' '}
                <Text weight="regular" ml="2">
                  Log out
                </Text>
              </a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </Flex>
  )
}
