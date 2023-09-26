'use client'

import { Card, Flex, Avatar, Box, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { StoryWithProfile } from '../../lib/database-helpers.types'
import { format } from 'timeago.js'
import { capitalize, initials } from '../../lib/utils'
import { Baby, Globe, GlobeSimple, Timer } from '@phosphor-icons/react'
import { ageGroups, languages } from '../enums'
export default function StoryCard({
  story,
  selected,
}: {
  story: StoryWithProfile
  selected: boolean
}) {
  return (
    <Card
      mx="1"
      my="3"
      className={selected ? 'story-card selected' : 'story-card'}
    >
      <Flex gap="3" align="start">
        <Avatar
          size="4"
          src={story.profiles?.avatar_url!}
          radius="full"
          color="cyan"
          fallback={initials(story.profiles.profile_name)}
        />
        <Box width="100%" style={{ cursor: 'pointer' }}>
          <Flex gap="3" align="center" justify="between" width="100%">
            {story.profiles && (
              <Text size="2" weight="medium">
                {story.profiles.profile_name}
              </Text>
            )}

            <Text size="1">{format(story.last_updated)}</Text>
          </Flex>

          <Text size="4" weight="bold">
            {story.title}
          </Text>

          <Flex gap="3" mt="1" align="center" style={{ opacity: 0.6 }}>
            {story.duration && (
              <Flex align="center" gap="1">
                <Timer size={14} weight="bold" />
                <Text size="1" weight="medium">
                  {Math.ceil(story.duration / 60)} min
                </Text>
              </Flex>
            )}
            {story.age_group && (
              <Flex align="center" gap="1">
                <Baby size={14} weight="bold" />
                <Text size="1" weight="medium">
                  {ageGroups.find((ag) => ag.name === story.age_group!)?.code}
                </Text>
              </Flex>
            )}
            {story.language && (
              <Flex align="center" gap="1">
                <GlobeSimple size={14} weight="bold" />
                <Text size="1" weight="medium">
                  {languages
                    .find((l) => l.name === story.language!)
                    ?.code.toLocaleUpperCase()}
                </Text>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Card>
  )
}
