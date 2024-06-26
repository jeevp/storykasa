export const FREE_SUBSCRIPTION_PLAN = "FREE_SUBSCRIPTION_PLAN"
export const PREMIUM_SUBSCRIPTION_PLAN = "PREMIUM_SUBSCRIPTION_PLAN"
export const PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN = "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"


interface SubscriptionProps {
    accountId: string;
    createdAt: string;
    subscriptionPlan: string;
    monthlyPrice: number;
    maxProfilesAllowed: number;
    maxRecordingTimeAllowed: number;
    adminAccount: boolean;
}

export default class Subscription {
    accountId: string;
    createdAt: string;
    subscriptionPlan: string;
    monthlyPrice: number;
    maxProfilesAllowed: number;
    maxRecordingTimeAllowed: number;
    adminAccount: boolean

    constructor({
        accountId,
        createdAt,
        subscriptionPlan,
        monthlyPrice,
        maxProfilesAllowed = 0,
        maxRecordingTimeAllowed = 0,
        adminAccount
    }: SubscriptionProps) {
        this.accountId = accountId
        this.createdAt = createdAt
        this.subscriptionPlan = subscriptionPlan
        this.monthlyPrice = monthlyPrice
        this.maxProfilesAllowed = maxProfilesAllowed
        this.maxRecordingTimeAllowed = maxRecordingTimeAllowed
        this.adminAccount = adminAccount
    }

    static getAllowedSubscriptionPlanNames() {
        return {
            FREE_SUBSCRIPTION_PLAN: "FREE_SUBSCRIPTION_PLAN",
            PREMIUM_SUBSCRIPTION_PLAN: "PREMIUM_SUBSCRIPTION_PLAN",
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN: "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"
        }
    }

    get subscriptionPlanName() {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN
        } = Subscription.getAllowedSubscriptionPlanNames()
        switch(this.subscriptionPlan) {
            case (FREE_SUBSCRIPTION_PLAN):
                return "Free"

            case (PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN):
                return "Premium Unlimited Organizational"

            case (PREMIUM_SUBSCRIPTION_PLAN):
                return "Premium"

            default:
                break
        }
    }

    getRecordingTimeUsagePercentage(totalRecordingTime: number) {
        if (!totalRecordingTime) return 0

        return (totalRecordingTime * 100) / this.maxRecordingTimeAllowed
    }
}
