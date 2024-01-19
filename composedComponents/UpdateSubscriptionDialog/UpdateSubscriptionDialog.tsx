import STKDialog from "@/components/STKDialog/STKDialog";
import {useRouter} from "next/router";
import STKButton from "@/components/STKButton/STKButton";
import useDevice from "@/customHooks/useDevice";
import {useEffect, useState} from "react";
import ChooseSubscriptionPlan from "@/composedComponents/ChooseSubscriptionPlan/ChooseSubscriptionPlan";
import StripeCheckout from "@/composedComponents/StripeCheckout/StripeCheckout";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";

interface HelperDialogProps {
    active: boolean
    onClose?: () => void
}

const CHOOSE_SUBSCRIPTION_PLAN_STEP = "CHOOSE_SUBSCRIPTION_PLAN_STEP"
const ADD_PAYMENT_DETAILS_STEP = "ADD_PAYMENT_DETAILS_STEP"

export default function UpdateSubscriptionDialog({ active, onClose = () => ({}) }: HelperDialogProps) {
    const [currentStep, setCurrentStep] = useState(CHOOSE_SUBSCRIPTION_PLAN_STEP)
    const [clientSecret, setClientSecret] = useState("")
    const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState("")

    const { setSnackbarBus } = useSnackbar()
    const { onMobile } = useDevice()

    useEffect(() => {
        setSelectedSubscriptionPlan("")
        setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)
        setClientSecret("")
    }, []);

    // Methods
    const generateView = () => {
        switch(currentStep) {
            case CHOOSE_SUBSCRIPTION_PLAN_STEP:
                return <ChooseSubscriptionPlan onNext={handleNext} />

            case ADD_PAYMENT_DETAILS_STEP:
                return (
                    <div className="flex justify-center">
                        <div className="max-w-2xl">
                            <StripeCheckout
                                clientSecret={clientSecret}
                                subscriptionPlan={selectedSubscriptionPlan}
                                onCancel={() => setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)}
                                onSuccess={handleSuccess}
                            />
                        </div>
                    </div>
                )

            default:
                break
        }
    }

    const handleNext = (subscriptionPlan, _clientSecret) => {
        setCurrentStep(ADD_PAYMENT_DETAILS_STEP)
        setClientSecret(_clientSecret)
        setSelectedSubscriptionPlan(subscriptionPlan)
    }

    const handleSuccess = async () => {
        await SubscriptionPlanHandler.updateSubscriptionPlan({
            subscriptionPlan: selectedSubscriptionPlan?.value
        })

        setSnackbarBus({
            active: true,
            message: "Subscription plan updated with success",
            type: "success"
        })

        onClose()
    }

    return (
        <STKDialog
        fullScreen={true}
        active={active}
        title=""
        onClose={() => onClose()}>
            <div>
                {generateView()}
            </div>
        </STKDialog>
    )
}
