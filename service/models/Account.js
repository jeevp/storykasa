const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")
const axios = require("axios")
const Profile = require("../models/Profile")

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

    static async findAll() {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/accounts`, {
            params: {
                select: "*"
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/accounts`, {
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
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
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
}


module.exports = Account
