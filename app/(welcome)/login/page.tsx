import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PageWrapper from '@/app/page-wrapper'
import { Heading } from '@radix-ui/themes'
import LoginForm from './login-form'

export const dynamic = 'force-dynamic'

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/profiles')
  }

  return (
    <PageWrapper path="login">
      <Heading mb="3" size="6">
        Log in
      </Heading>
      <div className="lg:w-96">
        <LoginForm></LoginForm>
      </div>
    </PageWrapper>
  )
}
