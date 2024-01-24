import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

class HeardAboutResearch {
    constructor({
        id,
        createdAt,
        userId,
        sources,
        otherSource
    }) {
        this.id = id
        this.createdAt = createdAt
        this.userId = userId
        this.sources = sources
        this.otherSource = otherSource
    }

    static async create({ sources, userId, otherSource }) {
        const payload = {}
        if (sources) payload.sources = sources
        if (userId) payload.user_id = userId
        if (otherSource) payload.other_source = otherSource

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/heard_about_research`,
            payload,
            {
                headers: generateSupabaseHeaders()
            }
        )

        return response.data
    }
}


module.exports = HeardAboutResearch
