import { Heading } from '@radix-ui/themes'
import StoryForm from '@/app/(home)/record/story-form'
import PageWrapper from '@/app/page-wrapper'

export default async function Record() {
  return (
    <PageWrapper path="record">
      <Heading mb="3" size="6">
        Add a story
      </Heading>
      <StoryForm></StoryForm>
    </PageWrapper>
  )
}
