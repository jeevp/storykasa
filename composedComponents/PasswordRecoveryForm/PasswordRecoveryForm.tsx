import {useState} from 'react'
import STKButton from "@/components/STKButton/STKButton";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKCard from "@/components/STKCard/STKCard";
import AuthHandler from "@/handlers/AuthHandler";
import { CheckCircle } from "@phosphor-icons/react"
import {green300, green600} from "@/assets/colorPallet/colors";
import {useRouter} from "next/router";


interface LoginFormProps {
    onCancel?: Function
}
export default function PasswordRecoveryForm({ onCancel = () => ({}) }: LoginFormProps) {
    // States
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [passwordRequestedWithSuccess, setPasswordRequestedWithSuccess] = useState(false)

    const router = useRouter()

    const handlePasswordRecoveryRequest = async (e: Event) => {
        e.preventDefault()
        try {
            setLoading(true)
            await AuthHandler.requestPasswordRecovery({ email })
            setPasswordRequestedWithSuccess(true)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="w-full lg:w-96">
            <STKCard>
                {passwordRequestedWithSuccess ? (
                    <div className="p-6">
                        <div className="flex justify-center">
                            <CheckCircle size={80} color={green600} />
                        </div>
                        <p className="text-center">
                            Thank you for submitting your password recovery request. If the email address you provided
                            is associated with an account in our system, you will receive an email with instructions
                            on how to reset your password shortly.
                        </p>
                        <div className="mt-6 flex justify-center">
                            <STKButton
                            fullWidth
                            onClick={() => onCancel()}>
                                Login
                            </STKButton>
                        </div>
                    </div>
                ) : (
                    <form className="p-6" onSubmit={handlePasswordRecoveryRequest}>
                        <div>
                            <p>
                                Enter the email address associated with your account
                                in the field below, and we’ll send you a link to reset your password.
                            </p>
                        </div>
                        <div>
                            <label className="font-semibold">Email address</label>
                            <div className="mt-2">
                                <STKTextField fluid placeholder="Type your email" onChange={(value: string) => setEmail(value)} />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center">
                            <div className="w-full">
                                <STKButton fullWidth variant="outlined" onClick={() => onCancel()}>
                                    Cancel
                                </STKButton>
                            </div>
                            <div className="ml-2 w-full">
                                <STKButton
                                    color="primary"
                                    variant="contained"
                                    loading={loading}
                                    fullWidth
                                    type="submit">
                                    Send request
                                </STKButton>
                            </div>
                        </div>
                    </form>
                )}
            </STKCard>
        </div>
    )
}
