const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")
const axios = require("axios")

const MONTHLY_STORY_IDEAS_ALLOWED = 30

class AccountToolsUsage {
    constructor({
        id,
        currentMonthTotalStoryIdeas,
        totalStoryIdeas,
        accountId,
    }) {
        this.accountId = accountId
        this.id = id
        this.currentMonthTotalStoryIdeas = currentMonthTotalStoryIdeas
        this.totalStoryIdeas = totalStoryIdeas
    }

    static async create({ accountId }) {
        const headers = generateSupabaseHeaders()

        const response = await axios.post(
        `${process.env.SUPABASE_URL}/rest/v1/account_tools_usage`,
        { account_id: accountId },
            {
                headers
            }
        )

        return new AccountToolsUsage({
            id: response.data.id,
            accountId: response.data.account_id,
            currentMonthTotalStoryIdeas: response.data.current_month_total_story_ideas,
            totalStoryIdeas: response.data.total_story_ideas
        })
    }

    static async findAll() {
        const headers = generateSupabaseHeaders()

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/account_tools_usage`, {
            headers,
            params: {
                select: "*"
            }
        })

        return response.data.map((data) => {
            return new AccountToolsUsage({
                id: data.id,
                accountId: data.account_id,
                currentMonthTotalStoryIdeas: data.current_month_total_story_ideas,
                totalStoryIdeas: data.total_story_ideas
            })
        })
    }

    static async findOne({ accountId }) {
        const headers = generateSupabaseHeaders()

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/account_tools_usage`, {
            headers,
            params: {
                account_id: `eq.${accountId}`
            }
        })


        if (response.data.length === 0) return null

        const {
            id,
            current_month_total_story_ideas,
            total_story_ideas,
            account_id
        } = response.data[0]

        return new AccountToolsUsage({
            id,
            accountId: account_id,
            totalStoryIdeas: total_story_ideas,
            currentMonthTotalStoryIdeas: current_month_total_story_ideas
        })
    }

    async update({ totalStoryIdeas, currentMonthTotalStoryIdeas }) {
        const headers = generateSupabaseHeaders()

        const payload = {}
        if (totalStoryIdeas) payload.total_story_ideas = totalStoryIdeas
        if (currentMonthTotalStoryIdeas) payload.current_month_total_story_ideas = currentMonthTotalStoryIdeas

        if (Object.keys(payload).length === 0) return

        await axios.patch(`
            ${process.env.SUPABASE_URL}/rest/v1/account_tools_usage`,
            payload, {
                headers,
                params: {
                    select: "*",
                    account_id: `eq.${this.accountId}`
                }
            }
        )

        if (currentMonthTotalStoryIdeas) this.currentMonthTotalStoryIdeas = currentMonthTotalStoryIdeas
        if (totalStoryIdeas) this.totalStoryIdeas = totalStoryIdeas

        return this
    }
}


module.exports = AccountToolsUsage;
module.exports.MONTHLY_STORY_IDEAS_ALLOWED = MONTHLY_STORY_IDEAS_ALLOWED;

