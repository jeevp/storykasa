import PageWrapper from '@/composedComponents/PageWrapper'
import SignupForm from '@/composedComponents/SignUpForm/SignUpForm'

export default function Profiles() {
    return (
        <PageWrapper path="signup">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <div className="lg:w-96 mt-5">
                    <SignupForm></SignupForm>
                </div>
            </div>
        </PageWrapper>
    )
}
