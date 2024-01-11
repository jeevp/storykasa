import PageWrapper from '@/composedComponents/PageWrapper'
import SignupForm from '@/composedComponents/SignUpForm/SignUpForm'
import {useState} from "react";
import ProfileCreationForm from "@/composedComponents/ProfileCreationForm/ProfileCreationForm";
import {useRouter} from "next/router";
import {useProfile} from "@/contexts/profile/ProfileContext";
import AccountPlanCard from '@/composedComponents/AccountPlanCard/AccountPlanCard';
import STKButton from "@/components/STKButton/STKButton";
import {
    FREE_SUBSCRIPTION_PLAN, PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
    PREMIUM_SUBSCRIPTION_PLAN,
    PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN
} from "@/models/Subscription";
import StripeCheckout from "@/composedComponents/StripeCheckout/StripeCheckout";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";

const USER_DETAILS_STEP = "USER_DETAILS_STEP"
const PROFILE_CREATION_STEP = "PROFILE_CREATION_STEP"
const CHOOSE_PLAN_STEP = "CHOOSE_PLAN_STEP"
const STRIPE_CHECKOUT_STEP = "STRIPE_CHECKOUT_STEP"

export default function Signup() {
    const [currentStep, setCurrentStep] = useState(USER_DETAILS_STEP)
    const [selectedPlan, setSelectedPlan] = useState({
        value: FREE_SUBSCRIPTION_PLAN
    });
    const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(null)
    const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false)

    const router = useRouter()
    const { currentProfile } = useProfile()
    const { setSnackbarBus } = useSnackbar()

    // Methods
    const goToDiscoverPage = async () => {
        await router.push("/discover")
    }

    const handleChoosePlan = async () => {
        if (selectedPlan.value === FREE_SUBSCRIPTION_PLAN) {
            setCurrentStep(PROFILE_CREATION_STEP)
        }

        setLoadingPaymentIntent(true)
        const _setupIntentClientSecret = await SubscriptionPlanHandler.createSetupIntent()
        // @ts-ignore
        setSetupIntentClientSecret(_setupIntentClientSecret)
        setLoadingPaymentIntent(false)

        setCurrentStep(STRIPE_CHECKOUT_STEP)
    }

    const plans = [
        {
            name: 'Free',
            price: '$0',
            features: [
                'Unlimited listening time to select stories',
                'Limited to 3 profiles',
                'Limited story recording time (60 minutes)',
                'Can add artwork to your own stories'
            ],
            isSelected: selectedPlan.value === FREE_SUBSCRIPTION_PLAN,
            value: FREE_SUBSCRIPTION_PLAN
        },
        {
            name: 'Premium',
            price: '$10',
            features: [
                'Unlimited listening time to all stories',
                'Limited to 5 profiles',
                'More story recording time (300 minutes)',
                'Can add artwork to any stories'
            ],
            isSelected: selectedPlan.value === PREMIUM_SUBSCRIPTION_PLAN,
            value: PREMIUM_SUBSCRIPTION_PLAN
        },
        {
            name: 'Premium Unlimited',
            price: '$20',
            features: [
                'Unlimited listening time to all stories',
                'Unlimited profiles',
                'Even more story recording (600 minutes)',
                'Can add artwork to any stories',
                'Enhanced story creation tools including AI based suggestions, text transcriptions, audio editing capabilities',
                'Co-create stories with others',
                'Add music to stories'
            ],
            isSelected: selectedPlan.value === PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN,
            value: PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN
        },
        {
            name: 'Premium Organizational',
            price: '$300',
            features: [
                'Unlimited listening time to all stories',
                'Unlimited profiles',
                'Even more story recording (600 minutes)',
                'Can add artwork to any stories',
                'Enhanced story creation tools including AI based suggestions, text transcriptions, audio editing capabilities',
                'Co-create stories with others',
                'Add music to stories',
                'Includes up to 100 premium users'
            ],
            isSelected: selectedPlan.value === PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            value: PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN
        }
    ];

    const handleUpdateSubscriptionPlan = async () => {
        await SubscriptionPlanHandler.updateSubscriptionPlan({
            subscriptionPlan: selectedPlan?.value
        })

        setCurrentStep(PROFILE_CREATION_STEP)
    }



    return (
        <PageWrapper path="signup">
            <div className="flex flex-col items-center pb-20">
                {currentStep === USER_DETAILS_STEP ? (
                    <>
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <div className="lg:w-96 mt-5 w-full">
                            <SignupForm onSuccess={() => setCurrentStep(CHOOSE_PLAN_STEP)} />
                        </div>
                    </>
                ) : currentStep === CHOOSE_PLAN_STEP ? (
                    <>
                        <h1 className="text-2xl font-bold">Choose your plan</h1>
                        <p className="mt-2 text-md text-gray-600 text-center max-w-2xl">Select the plan that best fits your needs. Compare the features below to make an informed decision. You can always change your plan later in your account settings.</p>

                        <div className="mt-8">
                            <div className="flex flex-col items-center lg:items-stretch box-border sm:flex-row justify-center mt-5 gap-4">
                                {plans.map(plan => (
                                    <AccountPlanCard
                                        key={plan.name}
                                        plan={plan}
                                        onSelect={() => setSelectedPlan(plan)}
                                    />
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end items-center">
                                <STKButton
                                    onClick={handleChoosePlan}
                                    loading={loadingPaymentIntent}>
                                    Continue
                                </STKButton>
                            </div>
                        </div>

                    </>
                ) : currentStep === STRIPE_CHECKOUT_STEP ? (
                    <StripeCheckout
                        clientSecret={setupIntentClientSecret}
                        subscriptionPlan={selectedPlan}
                        onSuccess={handleUpdateSubscriptionPlan}
                        onCancel={() => setCurrentStep(CHOOSE_PLAN_STEP)}/>
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
