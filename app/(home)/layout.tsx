import '@radix-ui/themes/styles.css'
import {
  Box,
  Container,
  Flex,
  Grid,
  Separator,
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
import Link from 'next/link'

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

  if (accounts && session) {
    return (
      <ProfileProvider>
        <Flex direction="row" align="start" justify="between" pb="3">
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            style={{ height: 'auto', width: 150 }}
            alt="StoryKasa logo"
          />
          <AccountDetails account={accounts[0]}></AccountDetails>
        </Flex>
        <Separator size="4"></Separator>
        <div className="flex-col flex lg:flex-row mt-12">
          <Box style={{ flex: 1.25 }}>
            <Nav></Nav>
          </Box>

          <Box className="lg:ml-14 mt-10 lg:mt-0" style={{ flex: 5 }}>{children}</Box>
        </div>
      </ProfileProvider>
    )
  } else {
    return (
      <ProfileProvider>
        <Flex direction="row" gap="7" mt="6">
          <Box style={{ flex: 1 }}>
            <Image
              src="/logo.svg"
              width={0}
              height={0}
              style={{ height: 'auto', width: 150 }}
              alt="StoryKasa logo"
            />
          </Box>
        </Flex>
      </ProfileProvider>
    )
  }
}
