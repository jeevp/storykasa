export const FREE_SUBSCRIPTION_PLAN = "FREE_SUBSCRIPTION_PLAN"
export const PREMIUM_SUBSCRIPTION_PLAN = "PREMIUM_SUBSCRIPTION_PLAN"
export const PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN = "PREMIUM_UNLIMITED_SUBSCRIPTION_PLAN"
export const PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN = "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"


interface SubscriptionProps {
    accountId: string;
    createdAt: string;
    name: string;
    active: boolean
    amount: number
}

export default class Subscription {
    accountId: string;
    createdAt: string;
    name: string;
    active: boolean
    amount: number

    constructor({
        accountId,
        createdAt,
        name,
        active,
        amount
    }: SubscriptionProps) {
        this.accountId = accountId
        this.createdAt = createdAt
        this.name = name
        this.active = active
        this.amount = amount
    }
}
