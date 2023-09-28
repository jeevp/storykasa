'use client'

import Image from 'next/image'
import {
  Card,
  Flex,
  Button,
  Separator,
  Text,
  Link,
} from '@radix-ui/themes'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import STKButton from "@/app/components/STKButton/STKButton";
import STKTextField from "@/app/components/STKTextField/STKTextField";

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  const handleSigninWithPassword = async (formData: FormData) => {
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

  const handleEmailOnChange = () => {

  }

  return (
    <Card mt="5">
      <div className="p-4">
        <div>
          <label className="font-semibold">Email address</label>
          <div className="mt-2">
            <STKTextField fluid placeholder="Email" onChange={handleEmailOnChange} />
          </div>
        </div>
        <div className="mt-4">
          <label className="font-semibold">Password</label>
          <div className="mt-2">
            <STKTextField fluid placeholder="Password" type="password" onChange={handleEmailOnChange} />
          </div>
        </div>
        <div className="mt-6 flex items-center">
          <div>
            <STKButton color="primary" forceColor variant="contained">Log in</STKButton>
          </div>
          <div className="ml-2">
            <STKButton variant="outlined">Forgot password</STKButton>
          </div>
        </div>
        {/*<Form.Root action={handleSigninWithPassword}>*/}
        {/*  <Form.Field name="email" asChild>*/}
        {/*    <Flex direction="column" gap="1" mb="3">*/}
        {/*      <Form.Label asChild>*/}
        {/*        <Text weight="bold" size="2">*/}

        {/*        </Text>*/}
        {/*      </Form.Label>*/}
        {/*      <Form.Control asChild>*/}
        {/*        <TextField.Input size="3" type="email" variant="soft" required />*/}
        {/*      </Form.Control>*/}
        {/*      <Form.Message match="valueMissing" asChild>*/}
        {/*        <Text color="tomato" weight="medium" size="2">*/}
        {/*          Please enter an email for your account*/}
        {/*        </Text>*/}
        {/*      </Form.Message>*/}
        {/*      <Form.Message match="typeMismatch" asChild>*/}
        {/*        <Text color="tomato" weight="medium" size="2">*/}
        {/*          Please provide a valid email address*/}
        {/*        </Text>*/}
        {/*      </Form.Message>*/}
        {/*    </Flex>*/}
        {/*  </Form.Field>*/}

        {/*  <Form.Field name="password" asChild>*/}
        {/*    <Flex direction="column" gap="1" mb="3">*/}
        {/*      <Form.Label asChild>*/}
        {/*        <Text weight="bold" size="2">*/}
        {/*          Password*/}
        {/*        </Text>*/}
        {/*      </Form.Label>*/}
        {/*      <Form.Control asChild>*/}
        {/*        <TextField.Input*/}
        {/*          size="3"*/}
        {/*          type="password"*/}
        {/*          variant="soft"*/}
        {/*          required*/}
        {/*        />*/}
        {/*      </Form.Control>*/}
        {/*      <Form.Message match="valueMissing" asChild>*/}
        {/*        <Text color="tomato" weight="medium" size="2">*/}
        {/*          Please enter a password for your account*/}
        {/*        </Text>*/}
        {/*      </Form.Message>*/}
        {/*    </Flex>*/}
        {/*  </Form.Field>*/}

        {/*  <Form.Submit asChild>*/}
        {/*    <Button size="3" mt="3" color="green" role="submit">*/}
        {/*      Log in*/}
        {/*    </Button>*/}
        {/*  </Form.Submit>*/}


        {/*  <Flex direction="column" gap="2" mt="5">*/}
        {/*    {errorMsg && (*/}
        {/*      <Callout.Root color="red" role="alert" variant="surface" size="1">*/}
        {/*        <Callout.Icon>*/}
        {/*          <Warning size={24} />*/}
        {/*        </Callout.Icon>*/}
        {/*        <Callout.Text weight="medium">{errorMsg}</Callout.Text>*/}
        {/*      </Callout.Root>*/}
        {/*    )}*/}
        {/*  </Flex>*/}
        {/*</Form.Root>*/}
        <Separator mb="6" mt="6" size="4" />
        <STKButton
            variant="outlined"
            fullWidth
            startIcon={
              <Image
                src="/google.svg"
                width={24}
                height={24}
                alt="Google logo"
              />
            }
            onClick={handleSignInWithGoogle}
        >
          Log in with Google
        </STKButton>

        <div className="flex justify-center mt-2">
          <Link href="/signup" size="3" underline="always">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </Card>
  )
}
