import { useState } from 'react';
import Subscription from "@/models/Subscription";

export default function useSubscriptionState() {
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

    return {
        currentSubscription,
        setCurrentSubscription
    };
}
