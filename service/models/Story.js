const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")

class Story {
    constructor({
        storyId,
        title,
        description,
        isPublic,
        transcript,
        language,
        region,
        theme,
        category,
        imageUrl,
        lastUpdated,
        recordingUrl,
        recordedBy,
        duration,
        ageGroups,
        profileName,
        profileAvatar,
        narratorName,
        accountId
    }) {
        this.storyId = storyId
        this.title = title
        this.description = description
        this.isPublic = isPublic
        this.transcript = transcript
        this.language = language
        this.region = region
        this.theme = theme
        this.category = category
        this.imageUrl = imageUrl
        this.lastUpdated = lastUpdated
        this.recordingUrl = recordingUrl
        this.recordedBy = recordedBy
        this.duration = duration
        this.ageGroups = ageGroups
        this.profileName = profileName
        this.profileAvatar = profileAvatar
        this.narratorName = narratorName
        this.accountId = accountId
    }

    static async getStory(storyId) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/stories`,
            {
                params: {
                    select: "*",
                    story_id: `eq.${storyId}`,
                },
                headers: generateSupabaseHeaders()
            }
        )

        const story = response.data[0]

        return new Story({
            storyId: story.story_id,
            title: story.title,
            description: story.description,
            isPublic: story.is_public,
            transcript: story.transcript,
            language: story.language,
            region: story.region,
            theme: story.theme,
            category: story.category,
            imageUrl: story.imageUrl,
            lastUpdated: story.lastUpdated,
            ageGroup: story.ageGroup,
            recordingUrl: story.recording_url,
            recordedBy: story.recorded_by,
            duration: story.duration,
            ageGroups: story.age_groups,
            narratorName: story.narrator_name,
            accountId: story.account_id
        })
    }

    static async getStories(filters = {
        narrator: "",
        language: "",
        ageGroups: [],
        storyLengths: [],
        private: false,
    }, params = { userId: "", profileId: "", libraryId: ""}) {
        // Prepare query parameters for filtering
        const queryParams = {
            select: '*,profiles!inner(*)',
        };

        let endpoint = `${process.env.SUPABASE_URL}/rest/v1/stories`
        if (filters?.private && params?.userId) {
            endpoint = `${process.env.SUPABASE_URL}/rest/v1/library_stories`
            queryParams.select = '*, stories (*, profiles (*))'
            queryParams.account_id = `eq.${params.userId}`
            queryParams.profile_id = `eq.${params.profileId}`
            queryParams["stories.deleted"] = `eq.false`
            queryParams.library_id = `eq.${params.libraryId}`
        } else {
            queryParams.is_public = "eq.true"
            queryParams.order = 'last_updated.desc'
        }

        let ageGroups = filters?.ageGroups
        if (ageGroups && !(ageGroups instanceof Array)) ageGroups = [filters?.ageGroups]

        // Add filter for language if provided
        if (filters?.language) {
            queryParams[filters.private ? 'stories.language' : 'language'] = `eq.${filters?.language}`;
        }

        // Add filter for ages if provided
        if (ageGroups && ageGroups.length) {
            queryParams[filters.private ? 'stories.age_groups' : 'age_groups'] = `ov.{${ageGroups.join(',')}}`;
        }

        // Make the request to Supabase
        const response = await axios.get(endpoint, {
            params: queryParams,
            headers: generateSupabaseHeaders()
        });

        let data = response.data;

        if (filters?.private) {
            data = response.data?.filter((story) => story.stories).map((story) => ({
                ...story.stories,
                library_created_at: story.created_at
            }))
        }

        if (data.length === 0) {
            return []
        }

        // Apply additional filtering for story lengths
        if (filters?.storyLengths && filters?.storyLengths.length) {
            data = data.filter(story => {
                if (!story?.duration) return false

                if (filters.storyLengths.includes('short') && story?.duration <= 300) {
                    return true;
                }
                if (filters.storyLengths.includes('medium') && story?.duration > 300 && story?.duration <= 600) {
                    return true;
                }
                if (filters.storyLengths.includes('long') && story?.duration > 600) {
                    return true;
                }
                return false;
            });
        }

        if (filters.narrator) {
            data = data.filter(story => {
                if (!story?.profiles) return false

                if (story?.narrator_name) {
                    return story?.narrator_name === filters.narrator
                }


                return story?.profiles?.profile_name === filters.narrator
            });
        }

        return data.filter((d) => d !== null).sort((a, b) => {
            if (a.library_created_at < b.library_created_at) return 1
            if (a.library_created_at > b.library_created_at) return -1
        });
    }

    static async findAll(params = { accountId: "" }) {
        require('dotenv').config({ path: '../../.env' });

        const searchParams = {
            select: "*",
            deleted: "eq.false"
        }
        if (params.accountId) searchParams["account_id"] = `eq.${params.accountId}`

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/stories`, {
            params: searchParams,
            headers: generateSupabaseHeaders()
        })

        return response.data.map((story) => {

            return new Story({
                storyId: story?.story_id,
                title: story?.title,
                description: story?.description,
                isPublic: story?.is_public,
                transcript: story?.transcript,
                language: story?.language,
                region: story?.region,
                theme: story?.theme,
                category: story?.category,
                imageUrl: story?.imageUrl,
                lastUpdated: story?.last_updated,
                createdAt: story?.created_at,
                ageGroups: story?.ageGroups,
                narratorName: story?.narrator_name,
                duration: story?.duration,
                recordedBy: story?.recorded_by,
                recordingUrl: story?.recording_url,
                profileName: story?.profiles?.profile_name,
                profileAvatar: story?.profiles?.avatar_url
            })
        })
    }

    /**
     *
     * @param {boolean} isPublic
     * @param {string} title
     * @param {string} description
     * @param {string} narratorName
     * @param {string} accountId
     * @returns {Promise<any>}
     */
    async update({
        isPublic,
        title,
        description,
        narratorName,
        accountId
    }) {
        require('dotenv').config({ path: '../../.env' });

        const payload = {}
        if (isPublic === false || isPublic === true) payload.is_public = isPublic
        if (title) payload.title = title
        if (description) payload.description = description
        if (narratorName) payload.narrator_name = narratorName
        if (accountId) payload.account_id = accountId

        if (Object.keys(payload).length === 0) throw new Error("Payload is missing")

        const response  = await axios.patch(
            `${process.env.SUPABASE_URL}/rest/v1/stories`,
            payload, {
                params: {
                  story_id: `eq.${this.storyId}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        const story = response.data[0]

        return new Story({
            storyId: story.story_id,
            title: story.title,
            description: story.description,
            isPublic: story.is_public,
            transcript: story.transcript,
            language: story.language,
            region: story.region,
            theme: story.theme,
            category: story.category,
            imageUrl: story.imageUrl,
            lastUpdated: story.last_updated,
            createdAt: story.created_at,
            ageGroups: story.ageGroups,
            narratorName: story.narrator_name,
            recordedBy: story?.recorded_by
        })
    }
}

module.exports = Story
