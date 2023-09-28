'use client'

import {
  Box,
  Button,
  ScrollArea,
} from '@radix-ui/themes'
import { Avatar } from "@mui/material"
import { StoryWithProfile } from '../../lib/database-helpers.types'
import {useContext, useState} from 'react'
import { ProfileContext } from '../profile-provider'
import { Baby, GlobeSimple, Trash } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
import DeleteStoryDialog from "@/app/composedComponents/DeleteStoryDialog/DeleteStoryDialog";

interface StoryDetailsProps {
  story: StoryWithProfile | null
}
export default function StoryDetails({ story }: StoryDetailsProps) {
  const router = useRouter()

  // States
  const [showDeleteStoryDialog, setShowDeleteStoryDialog] = useState(false)

  const { currentProfileID } = useContext(ProfileContext) as any

  return (
    <div>
      <Box>
        <h1 className="max-w-[12em] text-2xl font-semibold">{story?.title}</h1>
        <div className="mt-4 flex items-center">
          <Avatar
            src={story?.profiles?.avatar_url!}
          ></Avatar>
          <label className="ml-2 font-semibold text-base">{story?.profiles.profile_name}</label>
        </div>
        <div className="flex flex-col mt-4">
          {story?.age_group && (
            <div className="flex items-center">
              <Baby size={20} />
              <label className="ml-2">
                {story.age_group}
              </label>
            </div>
          )}
          {story?.language && (
            <div className="flex items-center mt-1">
              <GlobeSimple size={20} />
              <label className="ml-2">
                {story.age_group}
              </label>
            </div>
          )}
        </div>
        {story?.recording_url && (
            <div key={story.recording_url} className="mt-6">
              <STKAudioPlayer outlined src={story.recording_url} />
            </div>
        )}
        <div className="mb-8 mt-6">
          <Box mt="4">
            <ScrollArea scrollbars="vertical">
              {story?.description}
            </ScrollArea>
          </Box>
        </div>
        {currentProfileID === story?.profiles.profile_id && (
            <div>
              <Button size="2" my="3" variant="ghost" onClick={() => setShowDeleteStoryDialog(true)}>
                <Trash size={18} />
                <label className="ml-2">Delete story</label>
              </Button>
              <DeleteStoryDialog
              open={showDeleteStoryDialog}
              story={story}
              onClose={() => setShowDeleteStoryDialog(false)} />
            </div>
        )}
      </Box>
    </div>
  )
}
