import { Heading, Grid, ScrollArea } from '@radix-ui/themes'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import StoryForm from '@/app/(home)/record/story-form'

export default async function Record() {
  return (
    <div>
      <Heading mb="3" size="6">
        Record a new story
      </Heading>
      <Grid columns="2" gap="3">
        <StoryForm></StoryForm>
      </Grid>
    </div>
  )
}
