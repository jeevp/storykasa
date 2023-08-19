'use client'

import { Card, Flex, Avatar, Box, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { StoryWithProfile } from '../../lib/database-helpers.types'
import { format } from 'timeago.js'
import { initials } from '../../lib/utils'
export default function StoryCard({ story }: { story: StoryWithProfile }) {
  return (
    <Card variant="classic" mx="1" my="3">
      <Flex gap="3" align="center">
        <Avatar
          size="3"
          //   src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
          radius="full"
          color="cyan"
          fallback={
            story.profiles?.profile_name
              ? initials(story.profiles.profile_name)
              : 'SK'
          }
        />
        <Box width="100%" style={{ cursor: 'pointer' }}>
          <Flex gap="3" align="center" justify="between" width="100%">
            {story.profiles && (
              <Text size="1" weight="medium">
                {story.profiles.profile_name}
              </Text>
            )}

            <Text size="1">{format(story.last_updated)}</Text>

            {/* 
            <Text size="1" weight="medium">
              {story.is_public ? 'Saved' 'Recorded' } {story.profiles.profile_name}
            </Text> */}
          </Flex>

          <Text size="3" weight="bold">
            {story.title}
          </Text>
          <Flex gap="3" align="center">
            {story.duration && (
              <Text size="2">{Math.ceil(story.duration / 60)} min</Text>
            )}
            <Text size="2">Ages {story.age_group}</Text>
          </Flex>
        </Box>
      </Flex>
    </Card>
  )
}
