'use client'

import { addProfile, getProfiles } from '../../_actions'

import { useContext, useEffect, useState } from 'react'
import { ProfileContext } from '@/app/profile-provider'
import { Profile } from '@/app/database-helpers.types'
import { initials } from '@/app/utils'
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

export default function Profiles() {
  const { currentProfileID, setCurrentProfileID } = useContext(
    ProfileContext
  ) as any

  const router = useRouter()

  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

  const editProfile = (id: string) => {
    const profile = profileOptions.find((p: Profile) => {
      return p.profile_id === id
    })
    if (profile) {
      setProfileToEdit(profile)
    } else {
      throw new Error('tried to edit a profile that does not exist')
    }
  }

  const [managing, setManaging] = useState(false)

  const [profileOptions, setProfileOptions] = useState<Profile[]>([])

  const loadProfiles = async () => {
    const profiles: Profile[] = await getProfiles()
    setProfileOptions(profiles)
  }

  const selectProfile = (profile: Profile) => {
    console.log(profile)
    const id = profile.profile_id
    console.log('asdfjskaslsdjf')
    localStorage.setItem('currentProfileID', id)
    setCurrentProfileID(id)
    router.push('/library')
  }

  useEffect(() => {
    loadProfiles()
  }, [])

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

        {managing && (
          <IconButton
            radius="full"
            color="gray"
            variant="soft"
            style={{ width: 80, height: 80 }}
          >
            <Plus size={24} weight="bold"></Plus>
          </IconButton>
        )}
      </Flex>
      {profileToEdit && (
        <ProfileEditor profileToEdit={profileToEdit}></ProfileEditor>
      )}
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
