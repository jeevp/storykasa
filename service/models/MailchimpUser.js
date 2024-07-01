const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class MailchimpUser {
    constructor({
        userId,
        mailchimpMemberId,
    }) {
        this.userId = userId
        this.mailchimpMemberId = mailchimpMemberId
    }

    static async create({
        userId,
        mailchimpMemberId
    }) {
        if (!userId || !mailchimpMemberId) return
        const headers = generateSupabaseHeaders()
        const payload = {
            user_id: userId,
            mailchimp_member_id: mailchimpMemberId
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/mailchimp_user`,
            payload,
            {
                headers
            }
        )

        return new MailchimpUser({
            ...response.data[0]
        })
    }

    static async findOne({ userId }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/mailchimp_user`, {
            params: {
                select: "*",
                user_id: `eq.${userId}`
            },
            headers: generateSupabaseHeaders()
        })

        return new MailchimpUser({
            userId: response.data[0].user_id,
            mailchimpMemberId: response.data[0].mailchimp_member_id
        })
    }
}


module.exports = MailchimpUser
