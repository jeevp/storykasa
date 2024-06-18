import STKButton from "@/components/STKButton/STKButton";
import AccountPlanCard from "@/composedComponents/AccountPlanCard/AccountPlanCard";
import {
    FREE_SUBSCRIPTION_PLAN, PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
    PREMIUM_SUBSCRIPTION_PLAN,
} from "@/models/Subscription";
import {useEffect, useState} from "react";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";

export default function ChooseSubscriptionPlan({ onNext = () => ({}) }) {
    // States
    const [selectedPlan, setSelectedPlan] = useState<any>({
        value: FREE_SUBSCRIPTION_PLAN
    });
    const [loadingPaymentIntent, setLoadingPaymentIntent] = useState(false)

    const { currentSubscription } = useSubscription()

    // Watchers
    useEffect(() => {
        if (currentSubscription) {
            const _subscriptionPlan = plans.find((plan) => plan.value === currentSubscription.subscriptionPlan)
            setSelectedPlan(_subscriptionPlan)
        }
    }, [currentSubscription]);

    // Methods
    const handleChoosePlan = async () => {
        if (selectedPlan.value === FREE_SUBSCRIPTION_PLAN) {
            // @ts-ignore
            onNext(selectedPlan)
            return
        }

        setLoadingPaymentIntent(true)
        const _setupIntentClientSecret = await SubscriptionPlanHandler.createSetupIntent()
        // @ts-ignore
        setLoadingPaymentIntent(false)
        // @ts-ignore
        onNext(selectedPlan, _setupIntentClientSecret)
    }

    const plans = [
        {
            name: 'Free',
            extensionName: "",
            price: '$0',
            priceNumber: 0,
            features: [
                'Limited listening time to select stories',
                'Limited story recording time (60 minutes)',
                'Can add artwork to your own stories'
            ],
            isSelected: selectedPlan.value === FREE_SUBSCRIPTION_PLAN,
            value: FREE_SUBSCRIPTION_PLAN
        },
        {
            name: 'Premium',
            extensionName: "",
            price: '$5',
            priceNumber: 5,
            features: [
                'Unlimited listening time to all stories',
                'More story recording time (300 minutes)',
                'Can add artwork to all stories',
                'AI Story Idea Generator for endless inspiration',
                'AI Audio Transcription to support readers and language learners'
            ],
            isSelected: selectedPlan.value === PREMIUM_SUBSCRIPTION_PLAN,
            value: PREMIUM_SUBSCRIPTION_PLAN
        }
    ];

    return (
        <div>
            <div className="mt-8">
                <div className="mt-8 hidden lg:flex px-4 justify-end items-center">
                    <STKButton
                        onClick={handleChoosePlan}
                        disabled={selectedPlan?.value === currentSubscription?.subscriptionPlan}
                        loading={loadingPaymentIntent}>
                        Continue
                    </STKButton>
                </div>
                <div className="flex flex-col items-center lg:items-stretch box-border sm:flex-row justify-center mt-5">
                    {plans.map(plan => (
                        <AccountPlanCard
                            key={plan.name}
                            plan={plan}
                            onSelect={() => setSelectedPlan(plan)}
                        />
                    ))}
                </div>
                <div className="mt-8 flex lg:hidden px-4 justify-end items-center">
                    <STKButton
                        onClick={handleChoosePlan}
                        fullWidth
                        disabled={selectedPlan?.value === currentSubscription?.subscriptionPlan}
                        loading={loadingPaymentIntent}>
                        Continue
                    </STKButton>
                </div>
            </div>
        </div>
    )
}
