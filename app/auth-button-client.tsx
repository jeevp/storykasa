'use client'

import {
  Avatar,
  Box,
  Text,
  Button,
  DropdownMenu,
  Link,
  Separator,
  Flex,
} from '@radix-ui/themes'
import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { initials } from '../lib/utils'
import { SignOut, UserSwitch } from '@phosphor-icons/react'
// import { Account } from './database-helpers.types'

export default function AuthButtonClient({
  session,
}: {
  session: Session | null
}) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [account, setAccount] = useState<any>()

  useEffect(() => {
    const getAccount = async () => {
      const { data } = await supabase.from('accounts').select()
      if (data?.length) {
        setAccount(data[0])
      }
    }
    getAccount()
  }, [])

  // useEffect(() => {
  //   const getAccountInfo = async () => {
  //     if (!session) {
  //       throw new Error('invalid session')
  //     }

  //     const { data: accounts } = await supabase.from('accounts').select()

  //     if (!accounts) {
  //       throw new Error('unable to get account data')
  //     } else {
  //       console.log('found an account')
  //       return accounts[0]
  //     }
  //   }

  //   const accountInfo = getAccountInfo()
  //   console.log(accountInfo)
  //   if (accountInfo) {
  //     setAccount(accountInfo as any)
  //   }
  // }, [])

  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleSwitchProfiles = () => {
    router.push('/profiles')
  }

  return (
    <Box style={{ marginTop: '100px' }}>
      {/* <Separator my="4" size="4" /> */}
      {session && account ? (
        <div>
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
            <Button
              variant="ghost"
              color="gray"
              onClick={handleSwitchProfiles}
              style={{ width: 'fit-content' }}
            >
              <UserSwitch size={20} />{' '}
              <Text weight="medium" ml="1">
                Change profiles
              </Text>
            </Button>
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
        </div>
      ) : (
        <Button onClick={handleSignInWithGoogle}>Login</Button>
      )}
    </Box>
  )
}
