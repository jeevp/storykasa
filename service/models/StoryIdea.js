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
        characters = [],
        ageGroups = [],
        language,
        prompt
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
        this.ageGroups = ageGroups
        this.language = language
        this.prompt = prompt
    }

    static async create({
        title,
        setting,
        firstLine,
        profileId,
        accountId,
        creationStepsDescription,
        isFictional,
        language,
        ageGroups,
        prompt
    }) {
        const headers = generateSupabaseHeaders()
        const payload = {}

        if (title) payload.title = title
        if (setting) payload.setting = setting
        if (firstLine) payload.first_line = firstLine
        if (profileId) payload.profile_id = profileId
        if (accountId) payload.account_id = accountId
        if (creationStepsDescription) payload.creation_steps_description = creationStepsDescription
        if (isFictional === true || isFictional === false) payload.is_fictional = isFictional
        if (language) payload.language = language
        if (ageGroups) payload.age_groups = ageGroups
        if (prompt) payload.prompt = prompt

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
            createdAt: response.data[0].created_at,
            language: response.data[0].language,
            ageGroups: response.data[0].age_groups
        })
    }

    static async findAll({ accountId, profileId }, options = { serialized: false, page: 1 }) {
        const headers = generateSupabaseHeaders()
        const limit = 10
        const offset = (options.page - 1) * limit;

        const params = {
            select: "*",
            limit,
            offset,
            order: 'created_at.desc'
        }

        if (accountId) params.account_id = `eq.${accountId}`
        if (profileId) params.profile_id = `eq.${profileId}`

        const countResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/story_ideas?select=count`,
            {
                params: {
                    // Apply the same filters but don't include pagination parameters
                    account_id: accountId ? `eq.${accountId}` : undefined,
                    profile_id: profileId ? `eq.${profileId}` : undefined,
                },
                headers
            }
        );
        const totalStoryIdeas = countResponse.data[0].count;
        const totalPages = Math.ceil(totalStoryIdeas / limit);

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


        return {
            totalStoryIdeas,
            totalPages,
            storyIdeas: response.data.map((storyIdea) => {
                const characters = options.serialized ? storyIdeaCharactersHash[storyIdea.id] : []

                return new StoryIdea({
                    ...storyIdea,
                    firstLine: storyIdea.first_line,
                    profileId: storyIdea.profile_id,
                    accountId: storyIdea.account_id,
                    creationStepsDescription: storyIdea.creation_steps_description,
                    isFictional: storyIdea.is_fictional,
                    createdAt: storyIdea.created_at,
                    characters,
                    ageGroups: storyIdea.age_groups,
                    language: storyIdea.language,
                    prompt: storyIdea.prompt
                })
            })
        }
    }
}


module.exports = StoryIdea
