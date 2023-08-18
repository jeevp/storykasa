import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect, usePathname } from 'next/navigation'
import { Flex, Grid } from '@radix-ui/themes'

export default async function Home() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  } else {
    redirect('/library')
  }

  const { data: profiles } = await supabase.from('profiles').select()

  return (
    <Grid columns="2" gap="3">
      hello
      <Flex direction="column" gap="3">
        {profiles?.map((profile) => (
          <li key={profile.profile_id}>{profile.profile_name}</li>
        ))}

        {/* <pre style={{ fontSize: '0.6em' }}>
            {JSON.stringify(stories, null, 2)}
          </pre> */}
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
