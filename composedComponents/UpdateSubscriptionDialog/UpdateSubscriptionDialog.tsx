import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import {useEffect, useState} from "react";
import ChooseSubscriptionPlan from "@/composedComponents/ChooseSubscriptionPlan/ChooseSubscriptionPlan";
import StripeCheckout from "@/composedComponents/StripeCheckout/StripeCheckout";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import Subscription from "@/models/Subscription";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';import STKButton from "@/components/STKButton/STKButton";
import {green600} from "@/assets/colorPallet/colors";
import {useRouter} from "next/router";
interface HelperDialogProps {
    active: boolean
    onClose?: () => void
}

const CHOOSE_SUBSCRIPTION_PLAN_STEP = "CHOOSE_SUBSCRIPTION_PLAN_STEP"
const ADD_PAYMENT_DETAILS_STEP = "ADD_PAYMENT_DETAILS_STEP"
const SUCCESS_FEEDBACK_STEP = "SUCCESS_FEEDBACK_STEP"


export default function UpdateSubscriptionDialog({ active, onClose = () => ({}) }: HelperDialogProps) {
    const router = useRouter()

    const [promoCode, setPromoCode] = useState("")
    const [currentStep, setCurrentStep] = useState(CHOOSE_SUBSCRIPTION_PLAN_STEP)
    const [clientSecret, setClientSecret] = useState("")
    const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState("")
    const [previousSubscriptionPlan, setPreviousSubscriptionPlan] = useState(null)
    const { onMobile } = useDevice()

    // Contexts
    const { setCurrentSubscription, currentSubscription } = useSubscription()

    useEffect(() => {
        if (active) {
            setSelectedSubscriptionPlan("")
            setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)
            setClientSecret("")
            // @ts-ignore
            setPreviousSubscriptionPlan(currentSubscription)
        }
    }, [active]);


    // Methods
    const generateView = () => {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
        } = Subscription.getAllowedSubscriptionPlanNames()

        // @ts-ignore
        const previousSubscriptionPlanName = previousSubscriptionPlan?.subscriptionPlan

        switch(currentStep) {
            case CHOOSE_SUBSCRIPTION_PLAN_STEP:
                return (
                    <ChooseSubscriptionPlan
                    // @ts-ignore
                    onNext={handleNext} />
                )

            case ADD_PAYMENT_DETAILS_STEP:
                return (
                    <div className="flex justify-center">
                        <div className="max-w-2xl">
                            <StripeCheckout
                                clientSecret={clientSecret}
                                subscriptionPlan={selectedSubscriptionPlan}
                                onCancel={() => setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)}
                                onPromoCode={(_promoCode: string) => setPromoCode(_promoCode)}
                                // @ts-ignore
                                onSuccess={handleSuccess}
                            />
                        </div>
                    </div>
                )


            case SUCCESS_FEEDBACK_STEP:
                return (
                    <div className="flex items-center flex-col">
                        <div className="flex flex-col items-center max-w-md text-center">
                            <CheckCircleOutlineOutlinedIcon sx={{ width: "80px", height: "80px", color: green600 }} />
                            <label className="mt-2 font-semibold text-lg">Subscription plan updated with success</label>
                            {previousSubscriptionPlanName === FREE_SUBSCRIPTION_PLAN && currentSubscription?.subscriptionPlan === PREMIUM_SUBSCRIPTION_PLAN ? (
                                "Congratulations and thank you for upgrading to StoryKasa Premium! We are thrilled to have you as a premium member of our community"
                            ) : previousSubscriptionPlanName !== FREE_SUBSCRIPTION_PLAN && currentSubscription?.subscriptionPlan === PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN ? (
                                "Congratulations on elevating your organization's storytelling journey with StoryKasa Premium Organizational! We are excited to partner with your team and offer an unparalleled storytelling platform that caters to your organizational needs."
                            ) : "We're glad you're continuing your journey with us! Welcome to the StoryKasa Free experience, where the world of stories remains at your fingertips."}
                        </div>
                        <div className="mt-4">
                            <STKButton onClick={goToDiscoverPage}>Explore New Stories</STKButton>
                        </div>
                    </div>
                )

            default:
                break
        }
    }

    const handleNext = async (subscriptionPlan: any, _clientSecret: any) => {
        setSelectedSubscriptionPlan(subscriptionPlan)

        if (subscriptionPlan.value === Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN) {
            await handleSuccess(subscriptionPlan.value)
            return
        }

        setCurrentStep(ADD_PAYMENT_DETAILS_STEP)
        setClientSecret(_clientSecret)
    }

    const handleSuccess = async (subscriptionPlan: string) => {
        const updatedSubscriptionPlan = await SubscriptionPlanHandler.updateSubscriptionPlan({
            // @ts-ignore
            subscriptionPlan: subscriptionPlan || selectedSubscriptionPlan?.value,
            promoCode: promoCode
        })

        setCurrentSubscription(updatedSubscriptionPlan)

        setCurrentStep(SUCCESS_FEEDBACK_STEP)
    }

    const goToDiscoverPage = async () => {
        await router.push("/discover", "", { shallow: true })
    }



    return (
        <STKDialog
        fullScreen={onMobile}
        active={active}
        maxWidth={currentStep === CHOOSE_SUBSCRIPTION_PLAN_STEP ? "xl" : "sm"}
        includeBackArrow={currentStep === ADD_PAYMENT_DETAILS_STEP}
        title={currentStep === SUCCESS_FEEDBACK_STEP ? "" : "Update subscription plan"}
        onClose={() => onClose()}
        onBack={() => setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)}>
            <div className="pb-8">
                {generateView()}
            </div>
        </STKDialog>
    )
}
