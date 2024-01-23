import STKButton from "@/components/STKButton/STKButton";
import AccountPlanCard from "@/composedComponents/AccountPlanCard/AccountPlanCard";
import {
    FREE_SUBSCRIPTION_PLAN, PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
    PREMIUM_SUBSCRIPTION_PLAN,
    PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN
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
            extensionName: "",
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
            name: 'Premium',
            extensionName: "Unlimited",
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
            name: 'Premium',
            extensionName: "Organizational",
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
                        disabled={selectedPlan?.value === currentSubscription?.subscriptionPlan}
                        loading={loadingPaymentIntent}>
                        Continue
                    </STKButton>
                </div>
            </div>
        </div>
    )
}
