import {useState} from "react";
import PageWrapper from '@/composedComponents/PageWrapper'
import LoginForm from '@/composedComponents/LoginForm/LoginForm'
import PasswordRecoveryForm from "@/composedComponents/PasswordRecoveryForm/PasswordRecoveryForm";

function Login() {
    const [showPasswordRecoveryForm, setShowPasswordRecoveryForm] = useState(false)

    return (
        <PageWrapper path="login">
            <div className="flex flex-col items-center">
                {showPasswordRecoveryForm ? (
                    <>
                        <h2 className="text-2xl font-bold ">Password Recovery</h2>
                        <PasswordRecoveryForm onCancel={() => setShowPasswordRecoveryForm(false)}></PasswordRecoveryForm>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold ">Log in</h2>
                        <LoginForm onPasswordRecoveryRequest={() => setShowPasswordRecoveryForm(true)}></LoginForm>
                    </>
                )}
            </div>
        </PageWrapper>
    )
}

export default Login
