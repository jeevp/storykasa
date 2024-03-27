const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const StoryIdeaCharacter = require("../models/StoryIdeaCharacter")

class StoryIdea {
    constructor({
        id,
        title,
        setting,
        firstLine,
        profileId,
        accountId,
        creationStepsDescription,
        isFictional,
        createdAt,
        characters = []
    }) {
        this.id = id
        this.title = title
        this.setting = setting
        this.firstLine = firstLine
        this.profileId = profileId
        this.accountId = accountId
        this.creationStepsDescription = creationStepsDescription
        this.isFictional = isFictional
        this.createdAt = createdAt
        this.characters = characters
    }

    static async create({
        title,
        setting,
        firstLine,
        profileId,
        accountId,
        creationStepsDescription,
        isFictional
    }) {
        const headers = generateSupabaseHeaders()
        const payload = {}

        if (title) payload.title = title
        if (setting) payload.setting = setting
        if (firstLine) payload.first_line = firstLine
        if (profileId) payload.profile_id = profileId
        if (accountId) payload.account_id = accountId
        if (creationStepsDescription) payload.creationStepsDescription = creationStepsDescription
        if (isFictional === true || isFictional === false) payload.is_fictional = isFictional

        if (Object.keys(payload).length === 0) return

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/story_ideas`,
            payload,
            {
                headers
            }
        )

        return new StoryIdea({
            ...response.data[0],
            firstLine: response.data[0].first_line,
            profileId: response.data[0].profile_id,
            accountId: response.data[0].account_id,
            creationStepsDescription: response.data[0].creation_steps_description,
            isFictional: response.data[0].is_fictional,
            createdAt: response.data[0].created_at
        })
    }

    static async findAll({ accountId, profileId }, options = { serialized: false }) {
        const headers = generateSupabaseHeaders()

        const params = { select: "*" }
        if (accountId) params.account_id = `eq.${accountId}`
        if (profileId) params.profile_id = `eq.${profileId}`

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/story_ideas`,
            {
                params,
                headers
            }
        )

        let storyIdeaCharactersHash = {}

        if (options.serialized) {
            const storyIdeaIds = response.data.map((storyIdea) => storyIdea.id)
            const storyIdeaCharacters = await StoryIdeaCharacter.findAll({
                storyIdeaIds
            })

            storyIdeaCharactersHash = storyIdeaCharacters.reduce((acc, obj) => {
                // Use the storyIdeaId as the key for the groups
                const key = obj.storyIdeaId;
                // If the key doesn't exist yet, create it with an empty array
                if (!acc[key]) {
                    acc[key] = [];
                }
                // Push the current object into the appropriate group
                acc[key].push(obj);
                return acc;
            }, {});
        }

        return response.data.map((storyIdea) => {
            const characters = options.serialized ? storyIdeaCharactersHash[storyIdea.id] : []

            return new StoryIdea({
               ...storyIdea,
               firstLine: storyIdea.first_line,
               profileId: storyIdea.profile_id,
               accountId: storyIdea.account_id,
               creationStepsDescription: storyIdea.creation_steps_description,
               isFictional: storyIdea.is_fictional,
               createdAt: storyIdea.created_at,
               characters
            })
        })
    }
}


module.exports = StoryIdea
