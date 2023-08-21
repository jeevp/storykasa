import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button, Grid, Heading } from '@radix-ui/themes'
import PageWrapper from '@/app/page-wrapper'
import SignupForm from './signup-form'

export default async function Profiles() {
  return (
    <PageWrapper path="signup">
      <Heading mb="3" size="6">
        Create your account
      </Heading>
      <Grid columns="2" gap="5">
        <SignupForm></SignupForm>
      </Grid>
    </PageWrapper>
  )
}
