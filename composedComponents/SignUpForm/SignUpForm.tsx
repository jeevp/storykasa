import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import STKTextField from "@/components/STKTextField/STKTextField";
import STKButton from "@/components/STKButton/STKButton";
import {Divider} from "@mui/material";
import Link from "next/link";

export default function SignupForm() {
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const handleSignInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    const handleSignUp = async (formData: FormData) => {
        const { data, error } = await supabase.auth.signUp({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    full_name: formData.get('name') as string,
                },
            },
        })

        if (data) {
            router.push('/profiles')
        }

        if (error) {
            setErrorMsg(error.message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSignUp}>
                <div>
                    <div className="flex flex-col">
                        <div>
                            <label>Account name</label>
                        </div>

                        <div>
                           <STKTextField />
                        </div>
                        <div>
                            <label> Please enter a name for your account</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col">
                        <div>
                            <label>
                                Email address
                            </label>
                        </div>
                        <div>
                            <STKTextField />
                        </div>
                        <div>
                            <label>
                                Please enter an email for your account
                            </label>
                        </div>
                        <div>
                            <label>
                                Please provide a valid email address
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex flex-col">
                        <div>
                            <label>
                                Password
                            </label>
                        </div>
                        <div>
                            <STKTextField />
                        </div>
                        <div>
                            <label>
                                Please enter a password for your account
                            </label>
                        </div>
                        <div>
                            <p>
                                Password must contain at least one number, one uppercase letter,
                                one lowercase letter, and at least 8 or more characters
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <STKButton>
                        Create account
                    </STKButton>
                </div>

                <div className="flex justify-center">
                    {errorMsg && (
                        <label>
                            {errorMsg}
                        </label>
                    )}
                </div>
            </form>
            <Divider />
            <STKButton
                color="gray"
                variant="soft"
                onClick={handleSignInWithGoogle}
            >
                <Image
                    src="/google.svg"
                    width={24}
                    height={24}
                    alt="Google logo"
                ></Image>
                <span>Sign up with Google</span>
            </STKButton>

            <div>
                <Link href="/login" underline="always">
                    Already have an account? Log in
                </Link>
            </div>
        </div>
    )
}
