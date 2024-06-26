import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders"
import Subscription from "@/models/Subscription"


export default class SubscriptionPlanHandler {
    static async updateSubscriptionPlan({ subscriptionPlan, promoCode }: { subscriptionPlan: string, promoCode: string }) {
        const headers = generateHeaders()
        const payload: { subscriptionPlan: string, promoCode?: string } = { subscriptionPlan }
        if (promoCode) payload.promoCode = promoCode

        const response = await axios.put("/api/payments/subscription", payload, headers)

        return new Subscription({
            accountId: response.data.accountId,
            createdAt: response.data.createdAt,
            subscriptionPlan: response.data.subscriptionPlan,
            monthlyPrice: response.data.monthlyPrice,
            maxProfilesAllowed: response.data.maxProfilesAllowed,
            maxRecordingTimeAllowed: response.data.maxRecordingTimeAllowed,
            adminAccount: response.data.adminAccount
        })
    }

    static async createSetupIntent() {
        const headers = generateHeaders()
        const response = await axios.post("/api/payments/setupIntent", {}, headers)

        return response?.data?.clientSecret
    }

    static async attachPaymentMethodToCustomer({ paymentMethodId, promoCode }: { paymentMethodId: string, promoCode?: string }) {
        const headers = generateHeaders()
        const payload: { paymentMethodId: string, promoCode?: string } = { paymentMethodId }
        if (promoCode) payload.promoCode = promoCode

        const response = await axios.put("/api/payments/customers/attachPaymentMethods",
            payload,
            headers
        )

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
            maxRecordingTimeAllowed: response.data.maxRecordingTimeAllowed,
            adminAccount: response.data.adminAccount
        })
    }
}
