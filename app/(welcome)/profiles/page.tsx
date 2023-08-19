import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import ProfileSwitcher from './profile-switcher'
import { Button, Grid, Heading } from '@radix-ui/themes'
import PageWrapper from '@/app/page-wrapper'
import { cookies } from 'next/headers'

export default async function Profiles() {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (session) {
  //     redirect('/')
  //   }

  //   return <ProfileSwitcher session={session}></ProfileSwitcher>
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.from('profiles').select('*')
  if (!data) {
    throw new Error('unable to select from profiles table')
  }

  return (
    <PageWrapper path="profiles">
      <Heading mb="3" size="6">
        Choose a profile
      </Heading>
      <Grid columns="2" gap="3">
        <ProfileSwitcher profiles={data}></ProfileSwitcher>
      </Grid>
    </PageWrapper>
  )
}
