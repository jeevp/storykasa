'use client'

import * as Form from '@radix-ui/react-form'
import Image from 'next/image'
import {
  Card,
  Flex,
  TextField,
  Button,
  Separator,
  Text,
  Link,
} from '@radix-ui/themes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleSignUp = async (formData: FormData) => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          full_name: formData.get('name') as string,
        },
      },
    })

    if (data) {
      //   setSignedUp(true)
      router.push('/profiles')
    }

    if (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <Card mt="5">
      {/* {signedUp && 'Account created, check your email to confirm sign up'} */}

      <Form.Root action={handleSignUp}>
        <Form.Field name="name" asChild>
          <Flex direction="column" gap="1" mb="3">
            <Form.Label asChild>
              <Text weight="bold" size="2">
                Account name
              </Text>
            </Form.Label>
            {/* <Text weight="medium" size="2">
              This could be your name, or the name of your family or group.
            </Text> */}
            <Form.Control asChild>
              <TextField.Input size="3" type="text" variant="soft" required />
            </Form.Control>
            <Form.Message match="valueMissing" asChild>
              <Text color="tomato" weight="medium" size="2">
                Please enter a name for your account
              </Text>
            </Form.Message>
          </Flex>
        </Form.Field>

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
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
            </Form.Control>
            <Form.Message match="valueMissing" asChild>
              <Text color="tomato" weight="medium" size="2">
                Please enter a password for your account
              </Text>
            </Form.Message>
            <Form.Message match="patternMismatch" asChild>
              <Text color="tomato" weight="medium" size="2">
                Password must contain at least one number, one uppercase letter,
                one lowercase letter, and at least 8 or more characters
              </Text>
            </Form.Message>
          </Flex>
        </Form.Field>

        <Form.Submit asChild>
          <Button size="3" mt="3" color="green">
            Create account
          </Button>
        </Form.Submit>

        <Flex direction="column" gap="2" mt="3">
          {errorMsg && (
            <Text color="tomato" weight="medium" size="2">
              {errorMsg}
            </Text>
          )}
        </Flex>
      </Form.Root>
      <Separator mb="4" mt="5" size="4" />
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
        <Text weight="medium">Sign up with Google</Text>
      </Button>

      {/* <Link href="/sign-up">Forgot password</Link> */}
      <Flex mt="5">
        <Link href="/login" size="3" underline="always">
          Already have an account? Log in
        </Link>
      </Flex>
    </Card>
  )
}
