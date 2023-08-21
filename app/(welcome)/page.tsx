import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect, usePathname } from 'next/navigation'
import { Flex, Grid, Text, Heading, Button } from '@radix-ui/themes'
import HelpDialog from '../help-dialog'
import Link from 'next/link'
import { SignIn } from '@phosphor-icons/react'

export const dynamic = 'force-dynamic'

export default async function Welcome() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    console.log('signed in, going to library')
    redirect('/library')
  }

  return (
    <Grid columns="2" gap="5">
      <Flex direction="column" gap="3">
        <Heading size="8">Welcome to StoryKasa</Heading>
        <Text size="6" mt="4">
          StoryKasa is a platform where you can listen to stories or create your
          own!
        </Text>

        <Flex gap="3" mt="7">
          <Link href="/signup" passHref legacyBehavior>
            <Button color="grass" size="3">
              Create an account
            </Button>
          </Link>
          <Link href="/login" passHref legacyBehavior>
            <Button color="gray" variant="surface" size="3">
              Log in
            </Button>
          </Link>
        </Flex>
        {/* 
        <Link href="/signup">Create an account</Link>
        <Link href="/login">Log in</Link>
        <HelpDialog></HelpDialog> */}
      </Flex>
    </Grid>

    // <div className={styles.wrapper}>
    //   <header>
    //     <Image src="/logo.svg" width={150} height={120} alt="StoryKasa logo" />
    //   </header>
    //   <main>
    //     {profiles?.map((profile) => (
    //       <li key={profile.profile_id}>{profile.profile_name}</li>
    //     ))}

    //     <pre>{JSON.stringify(stories, null, 2)}</pre>

    //     {stories && (
    //       <audio controls>
    //         <source src={stories[stories.length - 1].recording_url!} />
    //       </audio>
    //     )}

    //     {/*
    //     {stories?.map((story) => (
    //       <li key={story.story_id}>{story.title}</li>
    //     ))} */}
    //     {/* <Flex direction="column" gap="2">
    //       <Text>Hello from Radix Themes :)</Text>
    //       <Button>Lets go</Button>
    //     </Flex> */}

    //     <NewProfile></NewProfile>
    //     <NewStory></NewStory>

    //     <nav>
    //       <button>Discover stories</button>
    //       <button>Discover stories</button>
    //       <button className="raised">
    //         <Microphone />
    //         Record a story
    //       </button>
    //       {/* @ts-expect-error Server Component */}
    //       <AuthButtonServer />
    //     </nav>
    //   </main>
    // </div>
  )
}
