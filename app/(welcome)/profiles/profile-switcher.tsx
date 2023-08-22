'use client'

import { addProfile, getProfiles } from '../../../lib/_actions'

import { useContext, useEffect, useState } from 'react'
import ProfileProvider, { ProfileContext } from '@/app/profile-provider'
import { Profile } from '@/lib/database-helpers.types'
import { initials } from '@/lib/utils'
import {
  Select,
  Flex,
  Avatar,
  Text,
  Card,
  Button,
  Box,
  IconButton,
} from '@radix-ui/themes'
import ProfileEditor from './profile-editor'
import { ArrowLeft, PencilSimple, Plus, Users } from '@phosphor-icons/react'
import { redirect, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ProfileSwitcher({ profiles }: { profiles: Profile[] }) {
  const { currentProfileID, setCurrentProfileID } = useContext(
    ProfileContext
  ) as any

  const supabase = createClientComponentClient<Database>()

  const [managing, setManaging] = useState(false)
  const [editing, setEditing] = useState(false)
  const [profileOptions, setProfileOptions] = useState<Profile[]>(profiles)
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

  const router = useRouter()

  const editProfile = (id: string) => {
    const profile = profileOptions.find((p: Profile) => {
      return p.profile_id === id
    })
    if (profile) {
      setEditing(true)
      setProfileToEdit(profile)
    } else {
      setEditing(true)
      setProfileToEdit(null)
    }
  }

  useEffect(() => {
    if (!profiles.length) {
      setManaging(true)
      setEditing(true)
    }

    // const channel = supabase
    //   .channel('*')
    //   .on(
    //     'postgres_changes',
    //     { event: 'INSERT', schema: 'public', table: 'posts' },
    //     (payload) => setProfileOptions((p: any) => [...p, payload.new])
    //   )
    //   .subscribe()

    // return () => {
    //   supabase.removeChannel(channel)
    // }
  }, [])

  const selectProfile = (profile: Profile) => {
    console.log(profile)
    const id = profile.profile_id
    localStorage.setItem('currentProfileID', id)
    setCurrentProfileID(id)
    router.push('/library')
  }

  return (
    <Box mt="5">
      <Flex direction="row" gap="5">
        {profileOptions.map((profile: Profile) => (
          <Flex
            key={profile.profile_id}
            direction="column"
            align="center"
            justify="center"
            style={{ position: 'relative' }}
          >
            <button
              className="profile-btn"
              onClick={() => selectProfile(profile)}
            >
              <Avatar
                style={{ width: 80, height: 80 }}
                radius="full"
                src={profile.avatar_url || ''}
                size="5"
                color="cyan"
                variant="soft"
                fallback={initials(profile.profile_name)}
              ></Avatar>
            </button>

            <Flex direction="row" gap="3" align="center" mt="2">
              <Text size="3" weight="bold">
                {profile.profile_name}
              </Text>
            </Flex>
            {managing && (
              <Button
                radius="full"
                size="1"
                onClick={() => editProfile(profile.profile_id)}
                color="gray"
                variant="soft"
              >
                <PencilSimple size={16} weight="bold"></PencilSimple>
                <Text weight="bold">Edit</Text>
              </Button>
            )}
          </Flex>
        ))}

        {managing && !editing && (
          <IconButton
            radius="full"
            color="gray"
            variant="soft"
            style={{ width: 80, height: 80 }}
            onClick={() => editProfile('')}
          >
            <Plus size={24} weight="bold"></Plus>
          </IconButton>
        )}
      </Flex>

      {managing && editing && !profileToEdit && !profiles.length && (
        <Flex direction="column" gap="2">
          <Text size="4" weight="bold">
            To get started, set up your first profile.
          </Text>
          <Text>
            Each member of your account can make a profile for creating and
            listening to stories. All members share the same account login
            information.
          </Text>
        </Flex>
      )}

      {managing && editing && profileToEdit && (
        <ProfileEditor profileToEdit={profileToEdit}></ProfileEditor>
      )}
      {managing && editing && !profileToEdit && <ProfileEditor></ProfileEditor>}

      <Button
        mt="6"
        variant="soft"
        radius="full"
        color="gray"
        onClick={() => setManaging(!managing)}
      >
        {managing ? (
          <>
            <ArrowLeft size={20} /> Back
          </>
        ) : (
          <>
            <Users size={20} /> Manage profiles
          </>
        )}
      </Button>
    </Box>
  )
}
