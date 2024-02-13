const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class Subscription {
    constructor({
        accountId,
        stripeAccountId,
        subscriptionPlan,
        monthlyPrice
    }) {
        this.accountId = accountId
        this.stripeAccountId = stripeAccountId
        this.subscriptionPlan = subscriptionPlan
        this.monthlyPrice = monthlyPrice
    }

    get maxProfilesAllowed() {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            PREMIUM_PLUS_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN,
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(this.subscriptionPlan) {
            case FREE_SUBSCRIPTION_PLAN:
                return 3
            case PREMIUM_SUBSCRIPTION_PLAN:
                return 5

            case PREMIUM_PLUS_SUBSCRIPTION_PLAN:
                return 10

            case PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN:
                return 5
            default:
                break
        }
    }

    get maxRecordingTimeAllowed() {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            PREMIUM_PLUS_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(this.subscriptionPlan) {
            case FREE_SUBSCRIPTION_PLAN:
                return 60
            case PREMIUM_SUBSCRIPTION_PLAN:
                return 300

            case PREMIUM_PLUS_SUBSCRIPTION_PLAN:
                return 600

            case PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN:
                return 600
            default:
                break
        }
    }


    static getAllowedSubscriptionPlanNames() {
        return {
            FREE_SUBSCRIPTION_PLAN: "FREE_SUBSCRIPTION_PLAN",
            PREMIUM_SUBSCRIPTION_PLAN: "PREMIUM_SUBSCRIPTION_PLAN",
            PREMIUM_PLUS_SUBSCRIPTION_PLAN: "PREMIUM_PLUS_SUBSCRIPTION_PLAN",
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN: "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"
        }
    }

    static getSubscriptionPlanPrice(subscriptionPlan) {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            PREMIUM_PLUS_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(subscriptionPlan) {
            case (FREE_SUBSCRIPTION_PLAN):
                return 0

            case (PREMIUM_PLUS_SUBSCRIPTION_PLAN):
                return 20

            case (PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN):
                return 300

            case (PREMIUM_SUBSCRIPTION_PLAN):
                return 10

            default:
                break
        }
    }

    static async create({ accountId, stripeAccountId, subscriptionPlan }) {
        const monthlyPrice = Subscription.getSubscriptionPlanPrice(subscriptionPlan)

        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/subscriptions`, {
            account_id: accountId,
            stripe_account_id: stripeAccountId,
            subscription_plan: subscriptionPlan,
            monthly_price: monthlyPrice
        }, {
            headers: generateSupabaseHeaders()
        })

        return response.data[0]
    }

    static async findOne({ accountId }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/subscriptions`, {
            params: {
                select: "*",
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders()
        })

        const subscription = response.data[0]

        if (!subscription) return null

        return new Subscription({
            accountId: subscription.account_id,
            stripeAccountId: subscription.stripe_account_id,
            subscriptionPlan: subscription.subscription_plan,
            monthlyPrice: subscription.monthly_price
        })
    }

    async update({ subscriptionPlan }) {
        const monthlyPrice = Subscription.getSubscriptionPlanPrice(subscriptionPlan)
        const response = await axios.patch(`${process.env.SUPABASE_URL}/rest/v1/subscriptions`, {
            subscription_plan: subscriptionPlan,
            monthly_price: monthlyPrice
        }, {
            params: {
                select: "*",
                account_id: `eq.${this.accountId}`
            },
            headers: generateSupabaseHeaders()
        })

        const subscription = response.data[0]


        if (!subscription) return null

        return new Subscription({
            accountId: subscription.account_id,
            stripeAccountId: subscription.stripe_account_id,
            subscriptionPlan: subscription.subscription_plan,
            monthlyPrice: subscription.monthly_price
        })
    }

    serializer() {
        return {
            accountId: this.accountId,
            stripeAccountId: this.stripeAccountId,
            subscriptionPlan: this.subscriptionPlan,
            monthlyPrice: this.monthlyPrice,
            maxProfilesAllowed: this.maxProfilesAllowed,
            maxRecordingTimeAllowed: this.maxRecordingTimeAllowed
        }
    }
}


module.exports = Subscription
