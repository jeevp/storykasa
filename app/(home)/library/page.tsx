'use client'

import {
  Flex,
  Text,
  Grid,
  Heading,
  Link,
  ScrollArea,
  TextField,
  Box,
  Callout,
} from '@radix-ui/themes'
import StoryCard from '@/app/(home)/story-card'
import { StoryWithProfile } from '@/lib/database-helpers.types'
import { useEffect, useState } from 'react'
import { getLibraryStories } from '@/lib/_actions'
import StoryDetails from '../story-details'
import PageWrapper from '@/app/page-wrapper'
import { AnimatePresence, motion } from 'framer-motion'
import { MagnifyingGlass, Warning } from '@phosphor-icons/react'
import InfoTooltip from '../info-tooltip'

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
        <Flex gap="2" align="center">
          My story library
          <InfoTooltip content="Stories in your library are private to your account, but can be accessed from any of your profiles."></InfoTooltip>
        </Flex>
      </Heading>

      <Grid columns="2" gap="5">
        {stories.length ? (
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              key={stories.length}
            >
              {stories.length > 0 && (
                <TextField.Root mt="2" mb="2">
                  <TextField.Slot>
                    <MagnifyingGlass size="20" />
                  </TextField.Slot>
                  <TextField.Input
                    placeholder="Search in my library..."
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
                    <StoryCard
                      story={story}
                      selected={selectedIndex === index}
                    ></StoryCard>
                  </a>
                ))}
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
        ) : (
          <Flex direction="column" gap="2" mt="5">
            <Callout.Root color="gray" variant="surface" size="1">
              <Box>
                <Heading size="6" weight="medium" color="gray">
                  No stories yet...{' '}
                </Heading>
                <Callout.Text weight="medium" mt="3" size="3">
                  Get started by{' '}
                  <Link underline="always" weight="medium" color="grass">
                    adding your first story
                  </Link>
                  .
                </Callout.Text>
              </Box>
            </Callout.Root>
          </Flex>
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
