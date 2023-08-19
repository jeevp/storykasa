'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import getBlobDuration from 'get-blob-duration'
import { StoryWithProfile } from './database-helpers.types'

// export const dynamic = 'force-dynamic'

export async function uploadRecording(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const recording = formData.get('recording')
  if (!recording) throw new Error('no recording found')

  const uuid = uuidv4()

  const { data, error } = await supabase.storage
    .from('storykasa-recordings')
    .upload(`${uuid}.webm`, recording, {
      cacheControl: '3600',
      upsert: false,
    })

  const publicURL = supabase.storage
    .from('storykasa-recordings')
    .getPublicUrl(`${uuid}.webm`)

  if (!publicURL.data.publicUrl)
    throw new Error("couldn't get public url for  recording")

  return publicURL.data.publicUrl
}

export async function addStory(formData: FormData) {
  console.log(formData)

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const recordedBy = formData.get('recorded_by') as string
  const language = formData.get('language') as string
  const ageGroup = formData.get('ageGroup') as string
  const recordingURL = formData.get('recording_url') as string
  const duration = parseInt(formData.get('duration') as string)

  const fakeLibraryID = '64621a80-c37d-4513-837b-6b66ddcb488e'

  const fakeStory = {
    is_public: false,
    title: title,
    recorded_by: recordedBy,
    recording_url: recordingURL,
    description: description,
    language: language,
    age_group: ageGroup,
    duration: duration,
    // category: '',
    // image_url: '...',
    // region: '',
    // theme: '',
  }

  const supabase = createServerActionClient<Database>({ cookies })
  const { data, error } = await supabase
    .from('stories')
    .insert(fakeStory)
    .select()

  if (error) console.log(error)
  var newStoryID = data![0].story_id

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // simulate the story "saving" process by adding it to the library_stories table
  if (data && user) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*, libraries(*)')
      .eq('account_id', user.id)

    if (error) console.log(error)
    await supabase.from('library_stories').insert({
      account_id: user.id,
      story_id: newStoryID,
      library_id: data![0].libraries![0].library_id,
    })
  }
}

// export async function getAccount() {
//   const supabase = createServerActionClient<Database>({ cookies })
//   const { data: accounts } = await supabase.from('accounts').select()
//   console.log(accounts)
// }

export async function updateAvatar(formData: FormData, filename: string) {}

export async function uploadAvatar(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const file = formData.get('file')
  if (!file) throw new Error('unable to get new avatar file')

  console.log(file)

  const uuid = uuidv4()

  const { data, error } = await supabase.storage
    .from('storykasa-avatars')
    .upload(`${uuid}.webp`, file, {
      cacheControl: '3600',
      upsert: false,
    })

  const publicURL = supabase.storage
    .from('storykasa-avatars')
    .getPublicUrl(`${uuid}.webp`)

  if (!publicURL.data.publicUrl)
    throw new Error("couldn't get public url for avatar")

  return publicURL.data.publicUrl
}

export async function addProfile(formData: FormData) {
  console.log(formData)

  const name = formData.get('name')
  if (!name) throw new Error('cannot add a profile without a name')
  const supabase = createServerActionClient<Database>({ cookies })

  const avatarURL = formData.get('avatar_url') as string

  if (formData.has('profile_id')) {
    const id = formData.get('profile_id') as string

    const newProfile = {
      profile_name: name as string,
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        profile_name: name as string,
        ...(formData.has('avatar_url') && { avatar_url: avatarURL }),
      })
      .eq('profile_id', id)

    console.log(data)
    console.log(error)
  } else if (!formData.has('profile_id')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          account_id: user.id as string,
          profile_name: name as string,
          ...(formData.has('avatar_url') && { avatar_url: avatarURL }),
        })
        .select()
      if (data) {
        console.log(data)
      }
    } else {
      throw new Error('unable to get user data needed to create profile')
    }
  }
}

// export async function uploadAvatar(formData: FormData) {
//   const supabase = createServerActionClient<Database>({ cookies })
//   const uuid = uuidv4()
//   const recording = formData.get('avatar')

//   const { data, error } = await supabase.storage
//     .from('storykasa-avatars')
//     .upload(`${uuid}.webm`, recording, {
//       cacheControl: '3600',
//       upsert: false,
//     })
// }

export async function getProfiles() {
  const supabase = createServerActionClient<Database>({ cookies })
  const { data: profiles } = await supabase.from('profiles').select()

  if (profiles) {
    return profiles
  } else {
    throw new Error('no profiles found')
  }
}

export async function getPublicStories(): Promise<StoryWithProfile[]> {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: stories } = await supabase
    .from('stories')
    .select('*, profiles (*)')
    .eq('is_public', true)
    .eq('account_id', user!.id)
    .order('last_updated', { ascending: false })

  if (stories) {
    return stories as StoryWithProfile[]
  } else {
    throw new Error('no public stories found')
  }
}

export async function getLibraryStories(): Promise<StoryWithProfile[]> {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('library_stories')
    .select('stories (*, profiles (*))')
    .eq('account_id', user!.id)
    .order('last_updated', { foreignTable: 'stories', ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const stories = data?.map((story) => story.stories)
  console.log(stories)

  return stories as StoryWithProfile[]
}
