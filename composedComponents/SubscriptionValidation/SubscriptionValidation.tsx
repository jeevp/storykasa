import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import {useEffect} from "react";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import {useAuth} from "@/contexts/auth/AuthContext";

export default function SubscriptionValidation() {
    const { setCurrentSubscription, currentSubscription } = useSubscription()
    const { currentUser } = useAuth()

    // Mounted
    useEffect(() => {
        if(currentUser && !currentUser?.isGuest) {
            handleFetchCurrentSubscriptionPlan()
        }
    }, [currentUser])

    // Methods
    const handleFetchCurrentSubscriptionPlan = async () => {
        const subscriptionPlan = await SubscriptionPlanHandler.fetchSubscriptionPlan()
        setCurrentSubscription(subscriptionPlan)
    }

    return <></>
}
