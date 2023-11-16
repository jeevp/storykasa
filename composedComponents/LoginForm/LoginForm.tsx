import {FormEvent} from 'react';
import Image from 'next/image'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import STKButton from "@/components/STKButton/STKButton";
import STKTextField from "@/components/STKTextField/STKTextField";
import Link from "next/link";
import {Divider} from "@mui/material";
import STKCard from "@/components/STKCard/STKCard";
import AuthHandler from "@/handlers/AuthHandler";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useProfile} from "@/contexts/profile/ProfileContext";
import {useTools} from "@/contexts/tools/ToolsContext";

const supabase = createClientComponentClient<Database>()

interface LoginFormProps {
    onPasswordRecoveryRequest?: Function
}
export default function LoginForm({ onPasswordRecoveryRequest = () => ({}) }: LoginFormProps) {
    // Contexts
    const { setPendoTrackingEnabled } = useTools()
    const { setCurrentProfile } = useProfile()

    // Hooks
    const router = useRouter()

    // States
    const [errorMsg, setErrorMsg] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // Watchers
    useEffect(() => {
        if (email || password) setErrorMsg("")
    }, [email, password]);

    // Methods
    const handleSigninWithPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setLoading(true)

            const account = await AuthHandler.signInWithPassword({ email, password })
            // @ts-ignore
            setPendoTrackingEnabled(true)

            setCurrentProfile(account?.defaultProfile)
            await router.push('/discover')
        } catch(error) {
            // @ts-ignore
            setErrorMsg(error?.response?.data?.message || "")
            setLoading(false)
        }
    }

    const handleSignInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `https://app.storykasa.com/process/oauth`,
            },
        })
    }


    return (
        <div className="w-full lg:w-96">
            <STKCard>
                <form className="p-6" onSubmit={handleSigninWithPassword}>
                    <div>
                        <label className="font-semibold">Email address</label>
                        <div className="mt-2">
                            <STKTextField fluid placeholder="Email" onChange={(value: string) => setEmail(value)} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="font-semibold">Password</label>
                        <div className="mt-2">
                            <STKTextField fluid placeholder="Password" type="password" onChange={(value: string) => setPassword(value)} />
                        </div>
                    </div>
                    <div className="mt-8 flex items-center flex-col lg:flex-row">
                        <div className="w-full">
                            <STKButton
                                color="primary"
                                variant="contained"
                                loading={loading}
                                fullWidth
                                type="submit">
                                Log in
                            </STKButton>
                        </div>
                        <div className="ml-0 lg:ml-2 mt-2 lg:mt-0 w-full">
                            <STKButton fullWidth variant="outlined" onClick={() => onPasswordRecoveryRequest()}>Forgot password</STKButton>
                        </div>
                    </div>
                    {errorMsg && (
                        <div className="flex justify-center mt-6">
                            <label className="text-red-800">{errorMsg}</label>
                        </div>
                    )}
                    <div className="py-6">
                        <Divider />
                    </div>
                    <div>
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

                    </div>
                    <div className="flex justify-center mt-4">
                        <Link href="/signup" className="text-neutral-800">
                            Don&apos;t have an account? Sign up
                        </Link>
                    </div>
                </form>
            </STKCard>
        </div>
    )
}
