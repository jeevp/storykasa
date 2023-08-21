'use client'

import { Box, Button, Grid, Heading, ScrollArea } from '@radix-ui/themes'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import StoryCard from '../story-card'
import { StoryWithProfile } from '../../../lib/database-helpers.types'
import { useEffect, useState } from 'react'
import { getPublicStories } from '../../../lib/_actions'
import StoryDetails from '../story-details'
import PageWrapper from '../../page-wrapper'
import { AnimatePresence, motion } from 'framer-motion'

export const dynamic = 'force-dynamic'

export default function Discover() {
  const [stories, setStories] = useState<StoryWithProfile[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>()

  const loadStories = async () => {
    const publicStories: StoryWithProfile[] = await getPublicStories()
    setStories(publicStories)
  }

  useEffect(() => {
    loadStories()
  }, [])

  return (
    <PageWrapper path="discover">
      <Heading mb="3" size="6">
        Discover stories
      </Heading>

      <Grid columns="2" gap="5">
        {stories && (
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              key={stories.length}
            >
              <ScrollArea
                type="scroll"
                scrollbars="vertical"
                style={{ height: '80vh' }}
              >
                {stories?.map((story: StoryWithProfile, index: number) => (
                  <a
                    key={story.story_id}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <StoryCard
                      story={story}
                      selected={index === selectedIndex}
                    ></StoryCard>
                  </a>
                ))}
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        )}
        {selectedIndex !== undefined && (
          <StoryDetails story={stories[selectedIndex]}></StoryDetails>
        )}
      </Grid>
    </PageWrapper>
  )
}
