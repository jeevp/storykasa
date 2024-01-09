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

    static getSubscriptionPlanAmount(subscriptionPlanName) {
        const {
            PREMIUM_SUBSCRIPTION_PLAN,
            PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN
        } = SubscriptionPlan.getAllowedSubscriptionPlanNames()

        switch(subscriptionPlanName) {
            case PREMIUM_SUBSCRIPTION_PLAN:
                return 10
            case PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN:
                return 20
            case PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN:
                return 300
            default:
                return 0
        }
    }
}


module.exports = SubscriptionPlan
