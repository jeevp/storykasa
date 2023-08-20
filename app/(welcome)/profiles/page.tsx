import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import ProfileSwitcher from './profile-switcher'
import { Button, Grid, Heading } from '@radix-ui/themes'
import PageWrapper from '@/app/page-wrapper'
import { cookies } from 'next/headers'
import { getProfiles } from '@/lib/_actions'
import ProfileProvider from '@/app/profile-provider'

export default async function Profiles() {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (session) {
  //     redirect('/')
  //   }

  //   return <ProfileSwitcher session={session}></ProfileSwitcher>
  const supabase = createServerComponentClient<Database>({ cookies })
  let profiles = await getProfiles()
  if (!profiles) profiles = []

  return (
    <ProfileProvider>
      <PageWrapper path="profiles">
        <Heading mb="3" size="6">
          Choose a profile
        </Heading>
        <Grid columns="2" gap="3">
          <ProfileSwitcher profiles={profiles}></ProfileSwitcher>
        </Grid>
      </PageWrapper>
    </ProfileProvider>
  )
}
