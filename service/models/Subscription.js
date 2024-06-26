const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const MailchimpService = require("@/service/services/MailchimpService/MailchimpService").default
const MailchimpUser = require("@/service/models/MailchimpUser")


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
            PREMIUM_SUBSCRIPTION_PLAN,
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(this.subscriptionPlan) {
            case FREE_SUBSCRIPTION_PLAN:
                return 3
            case PREMIUM_SUBSCRIPTION_PLAN:
                return 5

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
            PREMIUM_SUBSCRIPTION_PLAN
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(this.subscriptionPlan) {
            case FREE_SUBSCRIPTION_PLAN:
                return 60
            case PREMIUM_SUBSCRIPTION_PLAN:
                return 300

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
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN: "PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN"
        }
    }

    static getSubscriptionPlanPrice(subscriptionPlan) {
        const {
            FREE_SUBSCRIPTION_PLAN,
            PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
            PREMIUM_SUBSCRIPTION_PLAN
        } = Subscription.getAllowedSubscriptionPlanNames()

        switch(subscriptionPlan) {
            case (FREE_SUBSCRIPTION_PLAN):
                return 0

            case (PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN):
                return 300

            case (PREMIUM_SUBSCRIPTION_PLAN):
                return 5

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

    static async findAll() {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/subscriptions`, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders()
        })

        return response.data.map((subscription) => new Subscription({
            accountId: subscription.account_id,
            stripeAccountId: subscription.stripe_account_id,
            subscriptionPlan: subscription.subscription_plan,
            monthlyPrice: subscription.monthly_price
        }))
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

        const mailchimpUser = await MailchimpUser.findOne({ userId: this.accountId })
        let tags = [{ name: "welcome", status: "active" }]

        const { PREMIUM_SUBSCRIPTION_PLAN, FREE_SUBSCRIPTION_PLAN } = Subscription.getAllowedSubscriptionPlanNames()
        if (subscription.subscription_plan === PREMIUM_SUBSCRIPTION_PLAN) {
            tags = [
                ...tags,
                { name: "premium", status: "active" },
                { name: "free", status: "inactive" },
                { name: "switched_to_free", status: "inactive" }
            ]
        } else if (subscription.subscription_plan === FREE_SUBSCRIPTION_PLAN) {
            tags = [
                ...tags,
                { name: "premium", status: "inactive" },
                { name: "free", status: "inactive" },
                { name: "switched_to_free", status: "active" }
            ]
        }

        if (mailchimpUser) {
            await MailchimpService.updateListMemberTags({
                memberId: mailchimpUser.mailchimpMemberId
            }, {
                tags
            })
        }



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
