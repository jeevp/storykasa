import { FormEvent } from 'react';
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import STKButton from "@/components/STKButton/STKButton";
import STKTextField from "@/components/STKTextField/STKTextField";
import Link from "next/link";
import {Divider} from "@mui/material";
import STKCard from "@/components/STKCard/STKCard";
import AuthHandler from "@/handlers/AuthHandler";

interface LoginFormProps {
    onPasswordRecoveryRequest?: Function
}
export default function LoginForm({ onPasswordRecoveryRequest = () => ({}) }: LoginFormProps) {
    // Hooks
    const router = useRouter()

    // States
    const [errorMsg, setErrorMsg] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)


    const supabase = createClientComponentClient<Database>()

    // Watchers
    useEffect(() => {
        if (email || password) setErrorMsg("")
    }, [email, password]);

    // Methods
    const handleSigninWithPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setLoading(true)

            await AuthHandler.signInWithPassword({ email, password })

            await router.push('/profiles')
        } catch(error) {
            setErrorMsg("Something went wrong")
            setLoading(false)
        }
    }

    const handleSignInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
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
                    <div className="mt-8 flex items-center">
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
                        <div className="ml-2 w-full">
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

                    <div className="flex justify-center mt-4">
                        <Link href="/signup">
                            Don&apos;t have an account? Sign up
                        </Link>
                    </div>
                </form>
            </STKCard>
        </div>
    )
}
