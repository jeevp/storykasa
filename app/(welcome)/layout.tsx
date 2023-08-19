import { Box, Flex, Theme } from '@radix-ui/themes'
import Image from 'next/image'

import ProfileProvider from '../profile-provider'

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
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
          <Box mt="9">{/* <AuthButtonServer></AuthButtonServer> */}</Box>
        </Box>
        <Box style={{ flex: 4 }}>{children}</Box>
      </Flex>
    </ProfileProvider>
  )
}
