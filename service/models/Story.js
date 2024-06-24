const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")
const StoryIdea = require("../models/StoryIdea");
const OpenAIService = require("../services/OpenAIService/OpenAIService").default
// const ISO6391 = require('iso-639-1');

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
        transcriptWithTimestamp,
        lastUpdated,
        recordingUrl,
        recordedBy,
        duration,
        ageGroups,
        profileName,
        profileAvatar,
        narratorName,
        accountId,
        playCount = 0,
        finished,
        storyIdeaId
    }) {
        this.storyId = storyId
        this.title = title
        this.description = description
        this.isPublic = isPublic
        this.transcript = transcript
        this.transcriptWithTimestamp = transcriptWithTimestamp
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
        this.playCount = playCount
        this.finished = finished
        this.storyIdeaId = storyId
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
            transcriptWithTimestamp: story.transcript_with_timestamp,
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
            accountId: story.account_id,
            playCount: story.play_count,
            finished: story.finished
        })
    }

    static async getStories(filters = {
        narrator: "",
        language: "",
        ageGroups: [],
        storyLengths: [],
        private: false,
        finished: true
    }, params = { userId: "", profileId: "", libraryId: "", freeTier: false }) {
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
            if (params.libraryId) {
                queryParams.library_id = `eq.${params.libraryId}`
            }
            queryParams["stories.finished"] = `eq.${filters.finished || false}`
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

                if (filters.storyLengths.includes('short') && story?.duration <= 240) {
                    return true;
                }
                if (filters.storyLengths.includes('medium') && story?.duration > 240 && story?.duration < 600) {
                    return true;
                }
                if (filters.storyLengths.includes('long') && story?.duration >= 600) {
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

        if (params.freeTier) {
            const fiveMinutesInSeconds = 4 * 60
            data = data.map((story) => {
                const notAvailableOnFreeTier = story.duration > fiveMinutesInSeconds && !story.free_tier_exception

                if (notAvailableOnFreeTier) {
                    return {
                        ...story,
                        recording_url: ""
                    }
                }

                return story
            })
        }

        const { storyIdeas } = await StoryIdea.findAll({
            accountId: params.userId,
            profileId: params.profileId
        }, { serialized: true })

        const storyIdeasHash = storyIdeas.reduce((acc, item) => {
            acc[item["id"]] = item

            return acc
        }, {})

        return data.filter((d) => d !== null).sort((a, b) => {
            if (a.library_created_at < b.library_created_at) return 1
            if (a.library_created_at > b.library_created_at) return -1
        }).map((story) => {
            return {
                ...story,
                storyIdea: story?.story_idea_id ? storyIdeasHash[story.story_idea_id] : null
            }
        })
    }

    static async findAll(params = { accountId: "" }) {
        require('dotenv').config({ path: '.env' });

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
                transcriptWithTimestamp: story?.transcript_with_timestamp,
                narratorName: story?.narrator_name,
                duration: story?.duration,
                recordedBy: story?.recorded_by,
                recordingUrl: story?.recording_url,
                profileName: story?.profiles?.profile_name,
                profileAvatar: story?.profiles?.avatar_url,
                playCount: story?.play_count,
                finished: story?.finished
            })
        })
    }

    async getTranscript(options = { forceCreation: false }) {
        if (this.transcriptWithTimestamp && !options.forceCreation) return this.transcriptWithTimestamp

        const transcriptWithTimestamp = await OpenAIService.getTranscriptFromAudio(this.recordingUrl)

        await this.update({
            transcriptWithTimestamp
        })

        return transcriptWithTimestamp
    }

    /**
     *
     * @param {boolean} isPublic
     * @param {string} title
     * @param {string} description
     * @param {string} narratorName
     * @param {string} accountId
     * @param {number} playCount
     * @param {string} recordingURL
     * @param {string} duration
     * @param {string} language
     * @param {string[]} ageGroups
     * @param {string[]} illustrationsURL
     * @param {boolean} finished
     * @param {json[]} transcriptWithTimestamp
     * @returns {Promise<any>}
     */
    async update({
        isPublic,
        title,
        description,
        narratorName,
        accountId,
        playCount,
        recordingURL,
        duration,
        language,
        ageGroups,
        finished,
        illustrationsURL,
         transcriptWithTimestamp
    }) {
        require('dotenv').config({ path: '.env' });

        const payload = {}
        if (isPublic === false || isPublic === true) payload.is_public = isPublic
        if (title) payload.title = title
        if (description) payload.description = description
        if (narratorName) payload.narrator_name = narratorName
        if (accountId) payload.account_id = accountId
        if (playCount) payload.play_count = playCount
        if (recordingURL || recordingURL === "") payload.recording_url = recordingURL
        if (duration) payload.duration = duration
        if (language) payload.language = language
        if (ageGroups) payload.age_groups = ageGroups
        if (finished === true || finished === false) payload.finished = finished
        if (transcriptWithTimestamp) payload.transcript_with_timestamp = transcriptWithTimestamp

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

        if (illustrationsURL?.length > 0) {
            illustrationsURL.map(async(illustrationURL) => {
                await axios.post(
                    `${process.env.SUPABASE_URL}/rest/v1/stories_images`,
                    {
                        image_url: illustrationURL,
                        story_id: this.storyId
                    },
                    {
                        params: {
                            select: '*',
                            image_url: `not.eq.${illustrationURL}`
                        },
                        headers: generateSupabaseHeaders()
                    }
                )
            })
        }

        return new Story({
            storyId: story.story_id,
            title: story.title,
            description: story.description,
            isPublic: story.is_public,
            transcriptWithTimestamp: story.transcriptWithTimestamp,
            language: story.language,
            region: story.region,
            theme: story.theme,
            category: story.category,
            imageUrl: story.imageUrl,
            lastUpdated: story.last_updated,
            createdAt: story.created_at,
            ageGroups: story.age_groups,
            narratorName: story.narrator_name,
            recordedBy: story?.recorded_by,
            playCount: story?.play_count,
            finished: story?.finished,
            recordingUrl: story?.recording_url
        })
    }
}

module.exports = Story
