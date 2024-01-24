import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders"
import Subscription from "@/models/Subscription"


export default class SubscriptionPlanHandler {
    static async updateSubscriptionPlan({ subscriptionPlan }: { subscriptionPlan: string }) {
        const headers = generateHeaders()
        const response = await axios.put("/api/payments/subscription", {
            subscriptionPlan
        }, headers)

        return new Subscription({
            accountId: response.data.accountId,
            createdAt: response.data.createdAt,
            subscriptionPlan: response.data.subscriptionPlan,
            monthlyPrice: response.data.monthlyPrice,
            maxProfilesAllowed: response.data.maxProfilesAllowed,
            maxRecordingTimeAllowed: response.data.maxRecordingTimeAllowed
        })
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

    static async fetchSubscriptionPlan() {
        const headers = generateHeaders()
        const response = await axios.get("/api/subscription", headers)

        return new Subscription({
            accountId: response.data.accountId,
            createdAt: response.data.createdAt,
            subscriptionPlan: response.data.subscriptionPlan,
            monthlyPrice: response.data.monthlyPrice,
            maxProfilesAllowed: response.data.maxProfilesAllowed,
            maxRecordingTimeAllowed: response.data.maxRecordingTimeAllowed
        })
    }
}
