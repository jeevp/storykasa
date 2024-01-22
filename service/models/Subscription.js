const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class Subscription {
    constructor({
        accountId,
        stripeAccountId,
        subscriptionPlan,
    }) {
        this.accountId = accountId
        this.stripeAccountId = stripeAccountId
        this.subscriptionPlan = subscriptionPlan
    }


    static getAllowedSubscriptionPlanNames() {
        return {
            FREE_SUBSCRIPTION_PLAN: "FREE_SUBSCRIPTION_PLAN",
            PREMIUM_SUBSCRIPTION_PLAN: "PREMIUM_SUBSCRIPTION_PLAN",
            PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN: "PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN",
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN: "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"
        }
    }

    static async create({ accountId, stripeAccountId, subscriptionPlan }, { accessToken }) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
            account_id: accountId,
            stripe_account_id: stripeAccountId,
            subscription_plan: subscriptionPlan
        }, {
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data[0]
    }

    static async findOne({ accountId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
            params: {
                select: "*",
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        const subscription = response.data[0]

        if (!subscription) return null

        return new Subscription({
            accountId: subscription.account_id,
            stripeAccountId: subscription.stripe_account_id,
            subscriptionPlan: subscription.subscription_plan
        })
    }

    async update({ subscriptionPlan }, { accessToken }) {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
            subscription_plan: subscriptionPlan
        }, {
            params: {
                select: "*",
                account_id: `eq.${this.accountId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        console.log(response.data)

        return true
    }
}


module.exports = Subscription
