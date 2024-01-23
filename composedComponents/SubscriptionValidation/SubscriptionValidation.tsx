import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import {useEffect} from "react";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";

export default function SubscriptionValidation() {
    const { setCurrentSubscription, currentSubscription } = useSubscription()

    // Mounted
    useEffect(() => {
        handleFetchCurrentSubscriptionPlan()
    }, [])

    // Methods
    const handleFetchCurrentSubscriptionPlan = async () => {
        const subscriptionPlan = await SubscriptionPlanHandler.fetchSubscriptionPlan()
        setCurrentSubscription(subscriptionPlan)
    }

    return <></>
}
