import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import axios from "axios";
import {supabase} from "@supabase/auth-ui-shared";

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

        console.log(response.data)
        return new Account({
            accountId: response.data[0]?.account_id,
            createdAt: response.data[0]?.created_at,
            name: response.data[0]?.name,
            username: response.data[0]?.username,
            avatarUrl: response.data[0]?.avatar_url
        })
    }
}
