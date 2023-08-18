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
import AuthButtonServer from '../auth-button-server'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

  if (!session) {
    redirect('/login')
  }
  // if (!profiles) {
  //   throw new Error('failed to fetch profiles')
  // } else if (!profiles?.length) {
  //   redirect('/profiles')
  // }

  return (
    <ProfileProvider>
      <Flex direction="row" gap="6" mt="6">
        <Box style={{ flex: 1 }}>
          <Image
            src="/logo.svg"
            width="150"
            height="0"
            style={{ height: 'auto' }}
            alt="StoryKasa logo"
          />
          <Box mt="9">
            <Nav></Nav>

            {/* @ts-expect-error Server Component */}
            <AuthButtonServer></AuthButtonServer>
          </Box>
        </Box>

        <Box style={{ flex: 4 }}>{children}</Box>
      </Flex>
      {/* <ThemePanel></ThemePanel> */}
    </ProfileProvider>
  )
}
