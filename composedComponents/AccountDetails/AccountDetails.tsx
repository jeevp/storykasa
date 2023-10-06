'use client'

import { Account, Profile } from '@/lib/database-helpers.types'
import { useRouter } from 'next/navigation'

import { useContext, useEffect, useState } from 'react'
import ProfileContext from "@/contexts/ProfileContext";
import ProfileHandler from "@/handlers/ProfileHandler";
import STKAvatar from "@/components/STKAvatar/STKAvatar";
import STKButton from "@/components/STKButton/STKButton";
import AccountSideDrawer from "@/composedComponents/AccountSideDrawer/AccountSideDrawer";
import { ArrowSquareRight } from '@phosphor-icons/react'

export default function AccountDetails({ account }: { account: Account }) {
    const router = useRouter()

    const { currentProfileId, setCurrentProfileId } = useContext(ProfileContext)
    const [showAccountSideDrawer, setShowAccountSideDrawer] = useState(false)
    const [profileOptions, setProfileOptions] = useState<Profile[]>([])

    const loadProfiles = async () => {
        const profiles: Profile[] = await ProfileHandler.fetchProfiles()
        setProfileOptions(profiles)
    }

    const currentProfile = profileOptions?.find(
        (p) => p.profile_id === currentProfileId
    )

    useEffect(() => {
        loadProfiles()
    }, [currentProfileId])

    const handleSignOut = async () => {
        // localStorage.removeItem('currentProfileID')
        // await supabase.auth.signOut()
        //
        // router.refresh()
        // router.push('/')
    }

    return (
        <div className="flex items-center">
            {/*<HelpDialog></HelpDialog>*/}
            <div>
                <STKButton color="info" variant="text" startIcon={<STKAvatar src={currentProfile?.avatar_url as string} name={currentProfile?.profile_name} />} onClick={() => setShowAccountSideDrawer(true)}>
                    Felipe Fernandes
                    <span className="ml-2 flex items-center">
                        <ArrowSquareRight size={20} />
                    </span>
                </STKButton>
            </div>
            <AccountSideDrawer open={showAccountSideDrawer} onClose={() => setShowAccountSideDrawer(false)} />
            {/*{currentProfile && (*/}
            {/*    <DropdownMenu.Root>*/}
            {/*        <DropdownMenu.Trigger>*/}
            {/*            <Button variant="ghost">*/}
            {/*                <CaretDown size={16} />*/}
            {/*            </Button>*/}
            {/*        </DropdownMenu.Trigger>*/}
            {/*        <DropdownMenu.Content>*/}
            {/*            <DropdownMenu.Item asChild>*/}
            {/*                <a href="/profiles">*/}
            {/*                    <UserSwitch size={20} />{' '}*/}
            {/*                    <Text weight="regular" ml="2">*/}
            {/*                        Change profiles*/}
            {/*                    </Text>*/}
            {/*                </a>*/}
            {/*            </DropdownMenu.Item>*/}
            {/*            <DropdownMenu.Separator />*/}
            {/*            <Flex*/}
            {/*                direction="row"*/}
            {/*                gap="1"*/}
            {/*                align="center"*/}
            {/*                p="3"*/}
            {/*                justify="between"*/}
            {/*            >*/}
            {/*                <Avatar*/}
            {/*                    src={account.avatar_url || ""}*/}
            {/*                    size="2"*/}
            {/*                    fallback={initials(account.name)}*/}
            {/*                    radius="full"*/}
            {/*                ></Avatar>*/}
            {/*                <Flex direction="column" gap="0" style={{ maxWidth: 200 }}>*/}
            {/*                    <Text weight="regular" size="1">*/}
            {/*                        Account name*/}
            {/*                    </Text>*/}
            {/*                    <Text weight="medium" size="2">*/}
            {/*                        {account.name}*/}
            {/*                    </Text>*/}
            {/*                </Flex>*/}
            {/*            </Flex>*/}
            {/*            <DropdownMenu.Item asChild>*/}
            {/*                <a onClick={handleSignOut}>*/}
            {/*                    <SignOut size={20} />{' '}*/}
            {/*                    <Text weight="regular" ml="2">*/}
            {/*                        Log out*/}
            {/*                    </Text>*/}
            {/*                </a>*/}
            {/*            </DropdownMenu.Item>*/}
            {/*        </DropdownMenu.Content>*/}
            {/*    </DropdownMenu.Root>*/}
            {/*)}*/}
        </div>
    )
}
