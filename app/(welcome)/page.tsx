import { Text, Heading, Button } from '@radix-ui/themes'
import Link from 'next/link'
import React from "react";
import ValidateSession from "@/app/HOC/ValidateSession";

export const dynamic = 'force-dynamic'

export default async function Welcome() {


  return (
      <ValidateSession>
          <div>
              <Heading size="8">Welcome to StoryKasa</Heading>
              <div className="mt-4">
                  <Text size="6" mt="4">
                      StoryKasa is a platform where you can listen to stories or create your
                      own!
                  </Text>
              </div>
              <div className="flex items-center mt-14">
                  <Link href="/signup" passHref legacyBehavior>
                      <Button color="grass" size="3">
                          Create an account
                      </Button>
                  </Link>
                  <div className="ml-4">
                      <Link href="/login" passHref legacyBehavior>
                          <Button color="gray" variant="surface" size="3">
                              Log in
                          </Button>
                      </Link>
                  </div>
              </div>
          </div>
      </ValidateSession>
  )
}
