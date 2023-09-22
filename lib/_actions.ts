'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import { StoryWithProfile } from './database-helpers.types'

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
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const recordedBy = formData.get('recorded_by') as string
  const language = formData.get('language') as string
  const ageGroup = formData.get('age_group') as string
  const recordingURL = formData.get('recording_url') as string
  const duration = parseInt(formData.get('duration') as string)

  const newStory = {
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
    .insert(newStory)
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


export async function updateAvatar(formData: FormData, filename: string) {}

export async function uploadAvatar(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const file = formData.get('file')
  if (!file) throw new Error('unable to get new avatar file')

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
      .select()


    if (data) {
      return id
    }
  } else if (!formData.has('profile_id')) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let newProfileID

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
        return data[0].profile_id
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('account_id', user!.id)

  if (profiles) {
    return profiles
  } else {
    throw new Error("couldn't get profiles")
  }
}

export async function getPublicStories(): Promise<StoryWithProfile[]> {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('stories')
    .select('*, profiles (*)')
    .eq('is_public', true)
    .order('last_updated', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as StoryWithProfile[]
}

export async function getLibraryStories(): Promise<StoryWithProfile[]> {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('library_stories')
    .select('*, stories (*, profiles (*))')
    .eq('account_id', user!.id)
    .order('stories(last_updated)', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const stories = data?.map((story) => story.stories)

  return stories as StoryWithProfile[]
}

export async function deleteStory(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })
  const { error } = await supabase.from('stories').delete().eq('story_id', id)
  if (error) throw new Error(error.message)
}
