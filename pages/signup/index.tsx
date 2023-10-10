import PageWrapper from '@/composedComponents/PageWrapper'
import SignupForm from '@/composedComponents/SignUpForm/SignUpForm'

export default function Profiles() {
    return (
        <PageWrapper path="signup">
            <div className="flex flex-col items-center pb-20">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <div className="lg:w-96 mt-5 w-full">
                    <SignupForm></SignupForm>
                </div>
            </div>
        </PageWrapper>
    )
}
