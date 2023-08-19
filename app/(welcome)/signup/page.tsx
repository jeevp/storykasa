import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button, Grid, Heading } from '@radix-ui/themes'
import PageWrapper from '@/app/page-wrapper'
import SignupForm from './signup-form'

export default async function Profiles() {
  //   const supabase = createServerComponentClient<Database>({ cookies })
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (session) {
  //     redirect('/')
  //   }

  //   return <ProfileSwitcher session={session}></ProfileSwitcher>

  return (
    <PageWrapper path="signup">
      <Heading mb="3" size="6">
        Create your account
      </Heading>
      <Grid columns="2" gap="3">
        <SignupForm></SignupForm>
        {/* <AuthClientTest session={session}></AuthClientTest> */}

        {/* d@ts-expect-error */}
        {/* <AuthButtonServer></AuthButtonServer> */}
      </Grid>
    </PageWrapper>
  )
}
