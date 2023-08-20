'use client'

import { Account } from '@/lib/database-helpers.types'
import { initials } from '@/lib/utils'
import { UserSwitch, SignOut } from '@phosphor-icons/react'
import { Flex, Text, Avatar, Button, Box } from '@radix-ui/themes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AccountDetails({ account }: { account: Account }) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Box style={{ marginTop: 100 }}>
      <Flex direction="row" gap="3" align="center" mb="5">
        <Avatar
          src={account.avatar_url}
          size="1"
          fallback={initials(account.name)}
          radius="full"
        ></Avatar>
        <Text weight="medium" size="3">
          {account.name}
        </Text>
      </Flex>
      <Flex direction="column" gap="3" mt="6">
        <Link passHref href="/profiles">
          <Button variant="ghost" color="gray" style={{ width: 'fit-content' }}>
            <UserSwitch size={20} />{' '}
            <Text weight="medium" ml="1">
              Change profiles
            </Text>
          </Button>
        </Link>
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
