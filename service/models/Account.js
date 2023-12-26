import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import axios from "axios";
import Profile from "../models/Profile"


export default class Account {
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



    static async findOne({ accountId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/accounts`, {
            params: {
                select: "*",
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new Account({
            accountId: response.data[0]?.account_id,
            createdAt: response.data[0]?.created_at,
            name: response.data[0]?.name,
            username: response.data[0]?.username,
            avatarUrl: response.data[0]?.avatar_url
        })
    }

    static async getDefaultProfile({ accountId }, { accessToken }) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    account_id: `eq.${accountId}`
                },
                headers: generateSupabaseHeaders(accessToken)
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
