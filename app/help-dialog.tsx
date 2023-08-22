'use client'

import { Question } from '@phosphor-icons/react'
import { Dialog, Button, Flex, Text, Link } from '@radix-ui/themes'

export default function HelpDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="ghost" color="gray" style={{ width: 'fit-content' }}>
          <Question size={20} />{' '}
          <Text weight="medium" ml="1">
            Help
          </Text>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>StoryKasa Beta</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          StoryKasa is still in beta mode. If you experience any issues using
          the app or managing your account, please send us an email at{' '}
          <Link href="mailto:help@storykasa.com">help@storykasa.com.</Link>
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
