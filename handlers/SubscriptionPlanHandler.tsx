import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";

export default class SubscriptionPlanHandler {
    static async updateSubscriptionPlan({ subscriptionPlan }: { subscriptionPlan: string }) {
        const headers = generateHeaders()
        const response = await axios.put("/api/payments/subscription", {
            subscriptionPlan
        }, headers)

        return response?.data?.clientSecret
    }

    static async createSetupIntent() {
        const headers = generateHeaders()
        const response = await axios.post("/api/payments/setupIntent", {}, headers)

        return response?.data?.clientSecret
    }

    static async attachPaymentMethodToCustomer({ paymentMethodId }: { paymentMethodId: string }) {
        const headers = generateHeaders()
        const response = await axios.put("/api/payments/customers/attachPaymentMethods", {
            paymentMethodId
        }, headers)

        return response.data
    }
}
