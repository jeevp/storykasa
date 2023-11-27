const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

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

    static async getProfile(profileId, accessToken) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    profile_id: `eq.${profileId}`,
                },
                headers: generateSupabaseHeaders(accessToken)
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
}

module.exports = Profile
