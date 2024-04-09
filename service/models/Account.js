const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")
const axios = require("axios")
const Profile = require("../models/Profile")
const AccountToolsUsage = require("../models/AccountToolsUsage")
const {FREE_SUBSCRIPTION_PLAN} = require("../../models/Subscription");
const Subscription = require("../models/Subscription")

class Account {
    constructor({
        accountId,
        createdAt,
        name,
        username,
        avatarUrl,
    }) {
        this.accountId = accountId
        this.createdAt = createdAt
        this.name = name
        this.username = username
        this.avatarUrl = avatarUrl
    }

    static getAdminAccounts() {
        return [
            "rena@storykasa.com",
            "felipecpfernandes@gmail.com",
            "felipecpfernandes+joaopedro@gmail.com"
        ]
    }

    static async findAll() {
        const testAccountName = "Felipe Test"
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/accounts`, {
            params: {
                select: "*",
                name: `not.eq.${testAccountName}`
            },
            headers: generateSupabaseHeaders()
        })

        return response.data.map((account) => new Account({
            accountId: account?.account_id,
            createdAt: account?.created_at,
            name: account?.name,
            username: account?.username,
            avatarUrl: account?.avatar_url
        }))
    }

    static async findOne({ accountId }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/accounts`, {
            params: {
                select: "*",
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders()
        })

        return new Account({
            accountId: response.data[0]?.account_id,
            createdAt: response.data[0]?.created_at,
            name: response.data[0]?.name,
            username: response.data[0]?.username,
            avatarUrl: response.data[0]?.avatar_url
        })
    }

    static async getDefaultProfile({ accountId }) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    account_id: `eq.${accountId}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        const ascendantProfileAccounts = response.data?.sort((a, b) => {
            if (a.created_at > b.created_at) return 1
            if (a.created_at < b.created_at) return -1
        })

        if (!ascendantProfileAccounts || ascendantProfileAccounts?.length === 0) return null

        const profile = ascendantProfileAccounts[0]

        return new Profile({
            profileId: profile.profile_id,
            createdAt: profile.created_at,
            accountId: profile.account_id,
            profileName: profile.profile_name,
            avatarUrl: profile.avatar_url
        })
    }

    static async rechargeAccountsToolsUsage() {
        const accounts = await Account.findAll()

        accounts.map(async(account) => {
            const subscription = await Subscription.findOne({ accountId: account.accountId })
            if (subscription.subscriptionPlan === FREE_SUBSCRIPTION_PLAN) return

            const accountToolsUsage = AccountToolsUsage.findOne({ accountId: account.accountId })
            if (!accountToolsUsage) return

            await accountToolsUsage.update({ currentMonthTotalStoryIdeas: 0 })
        })
    }
}


module.exports = Account
