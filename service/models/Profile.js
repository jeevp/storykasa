const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const supabase = require("../supabase");

class Profile {
    constructor({
        profileId,
        createdAt,
        accountId,
        profileName,
        avatarUrl
    }) {
        this.profileId = profileId
        this.createdAt = createdAt
        this.accountId = accountId
        this.profileName = profileName
        this.avatarUrl = avatarUrl
    }

    static async getProfile(profileId) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    profile_id: `eq.${profileId}`,
                },
                headers: generateSupabaseHeaders()
            }
        )

        const profile = response.data[0]

        return new Profile({
            profileId: profile.profile_id,
            createdAt: profile.created_at,
            accountId: profile.account_id,
            profileName: profile.profile_name,
            avatarUrl: profile.avatar_url
        })
    }

    static async createProfile({ name, avatarUrl }, { accessToken }) {
        if (!name) {
            throw new Error("Cannot add a profile without a name.")
        }

        const { data: { user }} = await supabase.auth.getUser(accessToken)

        if (!user) throw new Error("User not found")

        const attributes = {
            account_id: user.id,
            profile_name: name
        }

        if (avatarUrl) attributes.avatar_url = avatarUrl

        const response = await axios.post(
            `${process.env.SUPABASE_URL}/rest/v1/profiles`,
            attributes,
            {
                params: {
                    select: "*"
                },
                headers: generateSupabaseHeaders()
            }
        )

        return response?.data[0]
    }

    static async getAccountProfiles({ accessToken }) {
        const {data: { user }} = await supabase.auth.getUser(accessToken)

        const userId = user.id

        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    account_id: `eq.${userId}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        return response.data
    }

    static async getDefaultAccountProfile({ accessToken }) {
        const profiles = await this.getAccountProfiles({ accessToken })

        const ascendantProfileAccounts = profiles?.sort((a, b) => {
            if (a.created_at > b.created_at) return 1
            if (a.created_at < b.created_at) return -1
        })

        if (!ascendantProfileAccounts || ascendantProfileAccounts?.length === 0) return null

        return ascendantProfileAccounts[0]
    }

    static async findAll() {
        require('dotenv').config({ path: '.env' });

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/profiles`, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders()
        })

        return response.data.map((profile) => new Profile({
            profileId: profile.profile_id,
            createdAt: profile.created_at,
            accountId: profile.account_id,
            profileName: profile.profile_name,
            avatarUrl: profile.avatar_url
        }))
    }
}

module.exports = Profile
