import STKDialog from "@/components/STKDialog/STKDialog";
import useDevice from "@/customHooks/useDevice";
import {useEffect, useState} from "react";
import ChooseSubscriptionPlan from "@/composedComponents/ChooseSubscriptionPlan/ChooseSubscriptionPlan";
import StripeCheckout from "@/composedComponents/StripeCheckout/StripeCheckout";
import {useSnackbar} from "@/contexts/snackbar/SnackbarContext";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import Subscription from "@/models/Subscription";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";

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

    // Contexts
    const { setCurrentSubscription } = useSubscription()
    const { setSnackbarBus } = useSnackbar()

    useEffect(() => {
        if (active) {
            setSelectedSubscriptionPlan("")
            setCurrentStep(CHOOSE_SUBSCRIPTION_PLAN_STEP)
            setClientSecret("")
        }
    }, [active]);

    // Methods
    const generateView = () => {
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
                                // @ts-ignore
                                onSuccess={handleSuccess}
                            />
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
            subscriptionPlan: subscriptionPlan || selectedSubscriptionPlan?.value
        })

        setCurrentSubscription(updatedSubscriptionPlan)

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
