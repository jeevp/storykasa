'use client'

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, supabase } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthClientTest({
  session,
}: {
  session: Session | null
}) {
  const supabase = createClientComponentClient<Database>()

  const router = useRouter()

  console.log(session)

  useEffect(() => {
    console.log({ session })
    if (session) {
      router.push('/profiles')
    }
  }, [session])

  return session ? (
    <div>Signed in</div>
  ) : (
    <Auth
      supabaseClient={supabase}
      redirectTo={`${location.origin}/auth/callback`}
      providers={['google']}
      appearance={{
        theme: ThemeSupa,
        className: { container: 'auth-container', button: 'raised-btn' },
      }}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Email address',
            password_label: 'Password',
          },
        },
      }}
    />
  )
}

/*

 <Card>
      <Auth supabaseClient={supabase}></Auth>
      <Flex direction="column" gap="3">
        <Flex direction="column" gap="3">
          <Flex asChild direction="column" gap="1">
            <Label>
              <Text weight="bold" size="2">
                Username
              </Text>
              <TextField.Input name="title" size="3" />
            </Label>
          </Flex>
          <Flex asChild direction="column" gap="1">
            <Label>
              <Text weight="bold" size="2">
                Password
              </Text>
              <TextField.Input name="password" size="3" />
            </Label>
          </Flex>
          <Button color="blue" size="3">
            <Text weight="medium">Sign in</Text>
          </Button>
        </Flex>

        <Separator orientation="horizontal"></Separator>
        <Button color="gray" variant="soft" size="3">
          <Image
            src="/google.svg"
            width={24}
            height={24}
            alt="Google logo"
          ></Image>
          <Text weight="medium">Log in with Google</Text>
        </Button>
      </Flex>
    </Card>


 */
