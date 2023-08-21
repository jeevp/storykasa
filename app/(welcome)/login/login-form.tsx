'use client'

import * as Form from '@radix-ui/react-form'
import Image from 'next/image'
import {
  Card,
  Box,
  Flex,
  TextField,
  Button,
  Separator,
  Text,
  Link,
  Callout,
} from '@radix-ui/themes'
import { Auth } from '@supabase/auth-ui-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Warning } from '@phosphor-icons/react'

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const handleSigninWithPassword = async (formData: FormData) => {
    console.log(formData)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })

    if (data.user && data.session) {
      router.push('/library')
    }
    if (error) {
      setErrorMsg(error.message)
    }
  }

  const handleSignInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Card mt="5">
      <Form.Root action={handleSigninWithPassword}>
        <Form.Field name="email" asChild>
          <Flex direction="column" gap="1" mb="3">
            <Form.Label asChild>
              <Text weight="bold" size="2">
                Email address
              </Text>
            </Form.Label>
            <Form.Control asChild>
              <TextField.Input size="3" type="email" variant="soft" required />
            </Form.Control>
            <Form.Message match="valueMissing" asChild>
              <Text color="tomato" weight="medium" size="2">
                Please enter an email for your account
              </Text>
            </Form.Message>
            <Form.Message match="typeMismatch" asChild>
              <Text color="tomato" weight="medium" size="2">
                Please provide a valid email address
              </Text>
            </Form.Message>
          </Flex>
        </Form.Field>

        <Form.Field name="password" asChild>
          <Flex direction="column" gap="1" mb="3">
            <Form.Label asChild>
              <Text weight="bold" size="2">
                Password
              </Text>
            </Form.Label>
            <Form.Control asChild>
              <TextField.Input
                size="3"
                type="password"
                variant="soft"
                required
              />
            </Form.Control>
            <Form.Message match="valueMissing" asChild>
              <Text color="tomato" weight="medium" size="2">
                Please enter a password for your account
              </Text>
            </Form.Message>
          </Flex>
        </Form.Field>

        <Form.Submit asChild>
          <Button size="3" mt="3" color="green" role="submit">
            Log in
          </Button>
        </Form.Submit>

        <Flex direction="column" gap="2" mt="5">
          {errorMsg && (
            <Callout.Root color="red" role="alert" variant="surface" size="1">
              <Callout.Icon>
                <Warning size={24} />
              </Callout.Icon>
              <Callout.Text weight="medium">{errorMsg}</Callout.Text>
            </Callout.Root>
          )}
        </Flex>

        <Separator mb="4" mt="5" size="4" />
      </Form.Root>
      <Button
        color="gray"
        variant="soft"
        size="3"
        onClick={handleSignInWithGoogle}
      >
        <Image
          src="/google.svg"
          width={24}
          height={24}
          alt="Google logo"
        ></Image>
        <Text weight="medium">Log in with Google</Text>
      </Button>

      {/* <Link href="/sign-up">Forgot password</Link> */}
      <Flex mt="5">
        <Link href="/signup" size="3" underline="always">
          Don&apos;t have an account? Sign up
        </Link>
      </Flex>
    </Card>
  )
}
