import {createContextProvider} from "@/contexts/createContextProvider";
import useSubscriptionState from "@/contexts/subscription/useSubscriptionState";

export const [SubscriptionProvider, useSubscription] = createContextProvider(useSubscriptionState)
