'use client'

import {
  AlertDialog,
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  ScrollArea,
  Text,
} from '@radix-ui/themes'
import { StoryWithProfile } from '../../lib/database-helpers.types'
import AudioPlayer from './record/audio-player'
import { capitalize, initials } from '../../lib/utils'
import { useContext } from 'react'
import { ProfileContext } from '../profile-provider'
import { Baby, GlobeSimple, Trash } from '@phosphor-icons/react'
import { deleteStory } from '@/lib/_actions'
import { useRouter } from 'next/navigation'

interface StoryDetailsProps {
  story: StoryWithProfile | null
}
export default function StoryDetails({ story }: StoryDetailsProps) {
  const router = useRouter()

  const handleDeleteStory = () => {
    if (story) {
      deleteStory(story.story_id)
      router.push('/')
    }
  }

  const { currentProfileID } = useContext(ProfileContext) as any

  return (
    <div>
      <Box px="4">
        <Heading size="6">{story?.title}</Heading>

        <Flex direction="row" align="center" mt="5">
          <Avatar
            src={story?.profiles?.avatar_url!}
            fallback={initials(story?.profiles?.profile_name || "")}
            size="2"
            mr="3"
            radius="full"
          ></Avatar>
          <Text size="3" weight="bold">
            {story?.profiles.profile_name}
          </Text>
        </Flex>
        <Flex direction="column" gap="1" mt="4">
          {story?.age_group && (
            <Flex direction="row" gap="1">
              <Baby size={20} />
              <Text size="2" weight="medium">
                {story.age_group}
              </Text>
            </Flex>
          )}
          {story?.language && (
            <Flex direction="row" gap="1">
              <GlobeSimple size={20} />
              <Text size="2" weight="medium">
                {capitalize(story.language)}
              </Text>
            </Flex>
          )}
        </Flex>
        {story?.recording_url && (
          <Card mt="6" variant="surface">
            <AudioPlayer
              src={story.recording_url}
              key={story.recording_url}
            ></AudioPlayer>
          </Card>
        )}
        <div className="mb-8">
          <Box mt="4">
            <ScrollArea scrollbars="vertical">
              {story?.description}
            </ScrollArea>
          </Box>
        </div>
        {currentProfileID === story?.profiles.profile_id && (
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button size="2" my="3" variant="ghost">
                <Trash size={18} />
                <Text>Delete story</Text>
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{ maxWidth: 450, margin: 20 }}>
              <AlertDialog.Title>
                Delete &ldquo;{story?.title}&rdquo;?
              </AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure you want to delete this story? Deleting a story is
                permanent and cannot be undone.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    color="red"
                    onClick={handleDeleteStory}
                  >
                    <Trash size={20}></Trash>Yes, delete story
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        )}
      </Box>
    </div>
  )
}
