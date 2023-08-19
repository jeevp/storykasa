'use client'

import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
} from '@radix-ui/themes'
import { StoryWithProfile } from '../../lib/database-helpers.types'
import AudioPlayer from './record/audio-player'
import { initials } from '../../lib/utils'
import { useContext } from 'react'
import { ProfileContext } from '../profile-provider'

export default function StoryDetails({ story }: { story: StoryWithProfile }) {
  const { currentProfileID } = useContext(ProfileContext) as any

  return (
    <div>
      <Box px="4">
        <Heading size="6">{story.title}</Heading>

        <Flex direction="row" align="center" mt="3">
          <Avatar
            fallback={initials(story.profiles.profile_name)}
            size="2"
            mr="3"
            radius="full"
          ></Avatar>
          <Text size="3" weight="medium">
            {story.profiles.profile_name}
          </Text>
        </Flex>
        <Box mt="4">
          <Text size="2" weight="medium">
            Ages {story.age_group}
          </Text>
        </Box>
        <Box mt="4">
          <Text size="3">{story.description}</Text>
        </Box>

        {currentProfileID === story.profiles.profile_id && (
          <Button size="1" my="3" variant="soft">
            Edit story
          </Button>
        )}
        {story.recording_url && (
          <Card mt="6" variant="surface">
            <AudioPlayer
              src={story.recording_url}
              key={story.recording_url}
            ></AudioPlayer>
          </Card>
        )}
      </Box>
    </div>
  )
}
