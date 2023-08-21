import { Box, Flex, Theme } from '@radix-ui/themes'
import Image from 'next/image'

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <Flex direction="row" gap="6" mt="6">
      <Box style={{ flex: 1 }}>
        <Image
          src="/logo.svg"
          width={0}
          height={0}
          style={{ height: 'auto', width: 150 }}
          alt="StoryKasa logo"
        />
      </Box>
      <Box style={{ flex: 5 }}>{children}</Box>
    </Flex>
  )
}
