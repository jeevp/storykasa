'use client'

import { Account } from '@/lib/database-helpers.types'
import { initials } from '@/lib/utils'
import { UserSwitch, SignOut } from '@phosphor-icons/react'
import { Flex, Text, Avatar, Button, Box } from '@radix-ui/themes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HelpDialog from '../help-dialog'

export default function AccountDetails({ account }: { account: Account }) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSignOut = async () => {
    localStorage.removeItem('currentProfileID')
    await supabase.auth.signOut()

    router.refresh()
    router.push('/')
  }

  return (
    <Box style={{ marginTop: 100 }}>
      <Flex direction="row" gap="3" align="center" mb="5">
        <Avatar
          src={account.avatar_url}
          size="2"
          fallback={initials(account.name)}
          radius="full"
        ></Avatar>
        <Flex direction="column" gap="0">
          <Text weight="regular" size="1">
            Logged in as
          </Text>
          <Text weight="medium" size="3">
            {account.name}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="column" gap="3" mt="6">
        <Link passHref legacyBehavior href="/profiles">
          <Button
            variant="ghost"
            color="gray"
            style={{ width: 'fit-content' }}
            mb="5"
          >
            <UserSwitch size={20} />{' '}
            <Text weight="medium" ml="1">
              Switch profiles
            </Text>
          </Button>
        </Link>
        <HelpDialog></HelpDialog>

        <Button
          variant="ghost"
          color="gray"
          onClick={handleSignOut}
          style={{ width: 'fit-content' }}
        >
          <SignOut size={20} />{' '}
          <Text weight="medium" ml="1">
            Logout
          </Text>
        </Button>
      </Flex>
    </Box>
  )
}
