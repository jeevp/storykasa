class SubscriptionPlan {
    constructor({
        accountId,
        name,
        amount,
        recurrence,
        active
    }) {
        this.accountId = accountId
        this.name = name
        this.amount = amount
        this.recurrence = recurrence
        this.active = active
    }


    static getAllowedSubscriptionPlanNames() {
        return {
            FREE_SUBSCRIPTION_PLAN: "FREE_SUBSCRIPTION_PLAN",
            PREMIUM_SUBSCRIPTION_PLAN: "PREMIUM_SUBSCRIPTION_PLAN",
            PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN: "PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN",
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN: "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"
        }
    }

    static getStripeSubscriptionPriceId(subscriptionPlanName) {
        const {
            PREMIUM_SUBSCRIPTION_PLAN,
            PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN
        } = SubscriptionPlan.getAllowedSubscriptionPlanNames()

        switch(subscriptionPlanName) {
            case PREMIUM_SUBSCRIPTION_PLAN:
                return process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID
            case PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN:
                return process.env.NEXT_PUBLIC_STRIPE_PREMIUM_UNLIMITED_PRICE_ID
            case PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN:
                return process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ORGANIZATIONAL_PRICE_ID
            default:
                return process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID
        }
    }
}


module.exports = SubscriptionPlan
