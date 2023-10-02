import PageWrapper from '@/composedComponents/PageWrapper'
import SignupForm from '@/composedComponents/SignUpForm/SignUpForm'

export default function Profiles() {
    return (
        <PageWrapper path="signup">
            <h1>Create your account</h1>
            <div className="lg:w-96">
                <SignupForm></SignupForm>
            </div>
        </PageWrapper>
    )
}
