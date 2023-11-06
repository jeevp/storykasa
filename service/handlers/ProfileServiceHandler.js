import supabase from "../supabase";
import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

class ProfileServiceHandler {
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
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
            attributes,
            {
                params: {
                    select: "*"
                },
                headers: generateSupabaseHeaders(accessToken)
            }
        )

        return response?.data[0]
    }

    static async getAccountProfiles({ accessToken }) {
        const {data: { user }} = await supabase.auth.getUser(accessToken)

        const userId = user.id

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
            {
                params: {
                    select: "*",
                    account_id: `eq.${userId}`
                },
                headers: generateSupabaseHeaders(accessToken)
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
}

module.exports = ProfileServiceHandler
