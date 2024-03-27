const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const axios = require("axios");

class StoryIdeaCharacter {
    constructor({
        id,
        storyIdeaId,
        name,
        description,
        createdAt
    }) {
        this.id = id
        this.storyIdeaId = storyIdeaId
        this.name = name
        this.description = description
        this.createdAt = createdAt
    }

    static async create({
        storyIdeaId,
        name,
        description,
    }) {
        const headers = generateSupabaseHeaders()
        const payload = {}

        if (storyIdeaId) payload.story_idea_id = storyIdeaId
        if (name) payload.name = name
        if (description) payload.description = description

        if (Object.keys(payload).length === 0) return

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/story_idea_characters`,
            payload,
            {
                headers
            }
        )

        return new StoryIdeaCharacter({
            ...response.data[0],
            storyIdeaId: response.data[0].story_idea_id
        })
    }

    static async findAll({ storyIdeaId, storyIdeaIds }) {
        const headers = generateSupabaseHeaders()

        const params = { select: "*" }
        if (storyIdeaId) params.story_idea_id = `eq.${storyIdeaId}`
        if (storyIdeaIds) params.story_idea_id = `in.(${storyIdeaIds})`

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/story_idea_characters`,
            {
                params,
                headers
            }
        )

        return response.data.map((storyIdea) => {
            return new StoryIdeaCharacter({
                ...storyIdea,
                storyIdeaId: storyIdea.story_idea_id
            })
        })
    }
}


module.exports = StoryIdeaCharacter
