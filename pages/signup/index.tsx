import PageWrapper from '@/composedComponents/PageWrapper'
import SignupForm from '@/composedComponents/SignUpForm/SignUpForm'
import {useContext, useState} from "react";
import ProfileCreationForm from "@/composedComponents/ProfileCreationForm/ProfileCreationForm";
import {useRouter} from "next/router";
import ProfileContext from "@/contexts/ProfileContext";

const USER_DETAILS_STEP = "USER_DETAILS_STEP"
const PROFILE_CREATION_STEP = "PROFILE_CREATION_STEP"

export default function Signup() {
    const [currentStep, setCurrentStep] = useState(USER_DETAILS_STEP)

    const router = useRouter()
    const { currentProfile } = useContext(ProfileContext)

    // Methods
    const goToDiscoverPage = async () => {
        await router.push("/discover")
    }

    return (
        <PageWrapper path="signup">
            <div className="flex flex-col items-center pb-20">
                {currentStep === USER_DETAILS_STEP ? (
                    <>
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <div className="lg:w-96 mt-5 w-full">
                            <SignupForm onSuccess={() => setCurrentStep(PROFILE_CREATION_STEP)} />
                        </div>
                    </>
                ) : currentStep === PROFILE_CREATION_STEP ? (
                    <>
                        <h1 className="text-2xl font-bold">Create your profile</h1>
                        <div className="lg:w-3/6 mt-5 w-full">
                            <p>
                                An account can have up to five profiles. Get started by creating a profile for
                                yourself. Later, you can create profiles for other members of your family or group.
                            </p>
                            <div className="mt-10">
                                <ProfileCreationForm
                                profile={currentProfile}
                                onSuccess={goToDiscoverPage} />
                            </div>
                        </div>
                    </>
                ) : null}

            </div>
        </PageWrapper>
    )
}
