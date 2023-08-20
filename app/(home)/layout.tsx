import { DM_Sans } from 'next/font/google'
import '@radix-ui/themes/styles.css'
import {
  Box,
  Container,
  Flex,
  Grid,
  Link,
  Theme,
  ThemePanel,
} from '@radix-ui/themes'
import '../themes-config.css'
import Image from 'next/image'

import type { Metadata } from 'next'
import Nav from './nav'
import ProfileProvider from '../profile-provider'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountDetails from './account-details'

export const dynamic = 'force-dynamic'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { data: accounts } = await supabase.from('accounts').select()

  return (
    <ProfileProvider>
      <Flex direction="row" gap="6" mt="6">
        <Box style={{ flex: 1 }}>
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            style={{ height: 'auto', width: 150 }}
            alt="StoryKasa logo"
          />
          {accounts && session && (
            <Box mt="9">
              <Nav></Nav>
              <AccountDetails account={accounts[0]}></AccountDetails>
            </Box>
          )}
        </Box>

        <Box style={{ flex: 4 }}>{children}</Box>
      </Flex>
    </ProfileProvider>
  )
}
