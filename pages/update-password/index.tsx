import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import queryString from "query-string"
import STKButton from "@/components/STKButton/STKButton";
import STKTextField from "@/components/STKTextField/STKTextField";
import STKCard from "@/components/STKCard/STKCard";
import AuthHandler from "@/handlers/AuthHandler";
import withoutAuth from "@/HOC/withoutAuth";
import PageWrapper from "@/composedComponents/PageWrapper";

interface LoginFormProps {
    onPasswordRecoveryRequest?: Function
}
function UpdatePassword({ onPasswordRecoveryRequest = () => ({}) }: LoginFormProps) {
    // Hooks
    const router = useRouter()

    // States
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [loading, setLoading] = useState(false)
    const [accessToken, setAccessToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")

    useEffect(() => {
        handleCredentials()
    }, []);

    // Methods
    const handleCredentials = () => {
        const queryParams = queryString.parse(location.hash)
        setAccessToken(queryParams?.access_token)
        setRefreshToken(queryParams?.refresh_token)
    }

    const handleUpdatePassword = async (e: Event) => {
        e.preventDefault()

        try {
            setLoading(true)
            await AuthHandler.updatePassword({ password }, {
                accessToken,
                refreshToken
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper path="password-update">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">Update Password</h1>
                <div className="w-full lg:w-96 mt-5">
                <STKCard>
                    <form className="p-6" onSubmit={handleUpdatePassword}>
                        <div>
                            <label className="font-semibold">Password</label>
                            <div className="mt-2">
                                <STKTextField fluid placeholder="Type Password" type="password" onChange={(value: string) => setPassword(value)} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold">Repeat password</label>
                            <div className="mt-2">
                                <STKTextField fluid placeholder="Type password" type="password" onChange={(value: string) => setPasswordRepeat(value)} />
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
                                    Update password
                                </STKButton>
                            </div>
                        </div>
                    </form>
                </STKCard>
            </div>
            </div>
        </PageWrapper>
    )
}


export default withoutAuth(UpdatePassword)
