import {useState} from "react";
import PageWrapper from '@/composedComponents/PageWrapper'
import LoginForm from '@/composedComponents/LoginForm/LoginForm'
import PasswordRecoveryForm from "@/composedComponents/PasswordRecoveryForm/PasswordRecoveryForm";
import withoutAuth from "@/HOC/withoutAuth";

function Login() {
    const [showPasswordRecoveryForm, setShowPasswordRecoveryForm] = useState(false)

    return (
        <PageWrapper path="login">
            <div className="flex flex-col items-center">
                {showPasswordRecoveryForm ? (
                    <>
                        <h1 className="text-2xl font-bold">Password Recovery</h1>
                        <div className="mt-5">
                            <PasswordRecoveryForm onCancel={() => setShowPasswordRecoveryForm(false)}></PasswordRecoveryForm>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold ">Log in</h1>
                        <div className="mt-5">
                            <LoginForm onPasswordRecoveryRequest={() => setShowPasswordRecoveryForm(true)}></LoginForm>
                        </div>
                    </>
                )}
            </div>
        </PageWrapper>
    )
}

export default withoutAuth(Login)
