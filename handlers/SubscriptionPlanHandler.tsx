import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";

export default class SubscriptionPlanHandler {
    static async updateSubscriptionPlan({ subscriptionPlan }: { subscriptionPlan: string }) {
        const headers = generateHeaders()
        const response = await axios.put("/api/subscription", {
            subscriptionPlan
        }, headers)

        return response?.data?.clientSecret
    }
}
