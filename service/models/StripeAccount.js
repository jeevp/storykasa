const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")

class StripeAccount {
    constructor({
        id,
        createdAt,
        accountId,
        stripeSubscriptionId,
        stripeCustomerId
    }) {
        this.id = id
        this.createdAt = createdAt
        this.accountId = accountId
        this.stripeSubscriptionId = stripeSubscriptionId
        this.stripeCustomerId = stripeCustomerId
    }

    static async create({
        accountId,
        stripeSubscriptionId,
        stripeCustomerId,
    }, { accessToken }) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stripe_accounts`, {
            account_id: accountId,
            stripe_subscription_id: stripeSubscriptionId,
            stripe_customer_id: stripeCustomerId
        }, {
            headers: generateSupabaseHeaders(accessToken)
        })

        const _stripeAccount = response.data[0]

        return new StripeAccount({
            id: _stripeAccount.id,
            createdAt: _stripeAccount.created_at,
            accountId: _stripeAccount.account_id,
            stripeSubscriptionId: _stripeAccount.stripe_subscription_id,
            stripeCustomerId: _stripeAccount.stripe_customer_id
        })
    }

    static async findOne({ accountId, stripeCustomerId }, { accessToken }) {
        const params = { select: "*" }
        if (accountId) params.account_id = `eq.${accountId}`
        if (stripeCustomerId) params.stripe_customer_id = `eq.${stripeCustomerId}`

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stripe_accounts`, {
            params,
            headers: generateSupabaseHeaders(accessToken)
        })

        const _stripeAccount = response.data[0]

        if (!_stripeAccount) return null

        return new StripeAccount({
            id: _stripeAccount.id,
            createdAt: _stripeAccount.created_at,
            accountId: _stripeAccount.account_id,
            stripeSubscriptionId: _stripeAccount.stripe_subscription_id,
            stripeCustomerId: _stripeAccount.stripe_customer_id
        })
    }

    static async findAll({ accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stripe_accounts`, {
            params: { select: "*" },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data.map((stripeAccount) => new StripeAccount({
            id: stripeAccount.id,
            createdAt: stripeAccount.created_at,
            accountId: stripeAccount.account_id,
            stripeSubscriptionId: stripeAccount.stripe_subscription_id,
            stripeCustomerId: stripeAccount.stripe_customer_id
        }))
    }
}


module.exports = StripeAccount
