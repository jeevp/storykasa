'use client'
import { useEffect, useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import Image from 'next/image'
import { Label } from '@radix-ui/react-label'
import {
  Button,
  Flex,
  IconButton,
  Select,
  TextArea,
  TextField,
  Text,
  Box,
  Card,
  Avatar,
  Theme,
  AlertDialog,
} from '@radix-ui/themes'
import {
  ArrowCircleRight,
  PencilSimple,
  Sparkle,
  UserPlus,
  X,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Profile } from '@/lib/database-helpers.types'
import { addProfile, uploadAvatar } from '@/lib/_actions'
import { resizeImage } from '@/lib/utils'

export default function ProfileEditor({
  profileToEdit,
}: {
  profileToEdit?: Profile
}) {
  const [images, setImages] = useState(
    profileToEdit ? [{ dataURL: profileToEdit.avatar_url } as any] : []
  )

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList as never[])
  }

  const router = useRouter()

  const [profileName, setProfileName] = useState('')

  const upsertProfile = async (profileFormData: FormData) => {
    if (profileToEdit) {
      profileFormData.set('profile_id', profileToEdit.profile_id)
    }

    if (
      profileFormData.has('name') &&
      profileFormData.get('name')!.length > 0
    ) {
      setProfileName(profileFormData.get('name') as string)
    } else {
      alert('Profile name cannot be empty')
    }

    // if there is a new avatar file, we need to upload to the bucket
    if (images.length && images[0].file) {
      const avatarFormData = new FormData()
      const file: Blob = await resizeImage(images[0].file, 200)
      avatarFormData.set('file', file)

      const avatarURL = await uploadAvatar(avatarFormData)
      profileFormData.set('avatar_url', avatarURL)
    }

    const id = await addProfile(profileFormData)
    if (id) {
      localStorage.setItem('currentProfileID', id)
    } else {
      throw new Error('unable to create profile')
    }
  }

  return (
    <Card variant="classic" mt="6">
      <Flex direction="row" gap="3" align="start" justify="between">
        <Label style={{ flex: 2 }}>
          <Text weight="medium" size="3">
            Profile name
          </Text>

          <Theme scaling="110%">
            <form action={upsertProfile}>
              <TextField.Input
                variant="soft"
                name="name"
                defaultValue={profileToEdit?.profile_name}
                size="3"
                mt="2"
              />

              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    size="2"
                    color="grass"
                    radius="full"
                    type="submit"
                    mt="4"
                  >
                    <UserPlus size={20} weight="duotone" />
                    <Text>Save profile</Text>
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content style={{ maxWidth: 450 }}>
                  <AlertDialog.Title>
                    {profileToEdit ? 'Updated' : 'Created'} profile for{' '}
                    {profileName}
                  </AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    Your profile is now up to date, and you are ready to use
                    StoryKasa.
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Action>
                      <Button onClick={() => router.push('/')} color="grass">
                        <ArrowCircleRight size="20"></ArrowCircleRight>
                        Enter StoryKasa
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </form>
          </Theme>
        </Label>

        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={1}
          resolutionHeight={100}
          resolutionWidth={100}
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div
              style={{
                position: 'relative',
                margin: '0 10px',
              }}
            >
              {imageList.length ? (
                <>
                  <IconButton
                    radius="full"
                    size="2"
                    color="tomato"
                    onClick={onImageRemoveAll}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '-10px',
                      zIndex: 3,
                    }}
                  >
                    <X size={16} weight="bold" />
                  </IconButton>
                  <Avatar
                    src={imageList[0].dataURL}
                    fallback={''}
                    size="7"
                    radius="full"
                    color="cyan"
                  ></Avatar>
                </>
              ) : (
                <>
                  <IconButton
                    radius="full"
                    size="2"
                    color="green"
                    onClick={onImageUpload}
                    {...dragProps}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '-10px',
                      zIndex: 3,
                    }}
                  >
                    <PencilSimple size={16} weight="bold" />
                    {/* <button
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                          >
                            Click or Drop here
                          </button> */}
                  </IconButton>
                  <Avatar
                    fallback={''}
                    size="7"
                    radius="full"
                    color="cyan"
                  ></Avatar>
                </>
              )}
            </div>
          )}
        </ImageUploading>
      </Flex>
    </Card>
  )
}
