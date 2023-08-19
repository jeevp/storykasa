'use client'

import { Grid, Heading, ScrollArea, TextField } from '@radix-ui/themes'
import StoryCard from '@/app/(home)/story-card'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { useEffect, useState } from 'react'
import { getLibraryStories } from '@/lib/_actions'
import StoryDetails from '../story-details'
import PageWrapper from '@/app/page-wrapper'
import { AnimatePresence, motion } from 'framer-motion'
import { MagnifyingGlass } from '@phosphor-icons/react'

export default function Library() {
  const [filterQuery, setFilterQuery] = useState('')
  const [stories, setStories] = useState<StoryWithProfile[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>()

  const handleFilterQueryChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFilterQuery(e.currentTarget.value)
  }

  const loadStories = async () => {
    const allStories: StoryWithProfile[] = await getLibraryStories()
    setStories(allStories)
  }

  const filtered = stories
    ? stories.filter((story) =>
        story.title.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : []

  useEffect(() => {
    loadStories()
  }, [])

  return (
    <PageWrapper path="library">
      <Heading mb="3" size="6">
        My story library
      </Heading>

      <Grid columns="2" gap="3">
        {stories && (
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              key={stories.length}
            >
              {stories.length > 0 && (
                <TextField.Root>
                  <TextField.Slot>
                    <MagnifyingGlass size="20" />
                  </TextField.Slot>
                  <TextField.Input
                    placeholder="Search for a story..."
                    value={filterQuery}
                    onChange={handleFilterQueryChange}
                    variant="soft"
                  />
                </TextField.Root>
              )}
              <ScrollArea
                type="scroll"
                scrollbars="vertical"
                style={{ height: '80vh' }}
              >
                {filtered?.map((story: StoryWithProfile, index: number) => (
                  <a
                    key={story.story_id}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <StoryCard story={story}></StoryCard>
                  </a>
                ))}
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        )}

        {selectedIndex !== undefined && (
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              key={selectedIndex}
            >
              <StoryDetails story={stories[selectedIndex]}></StoryDetails>
            </motion.div>
          </AnimatePresence>
        )}
      </Grid>
    </PageWrapper>
  )
}
