import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

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
        narratorName
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
    }

    static async getStory(storyId, accessToken) {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`,
            {
                params: {
                    select: "*",
                    story_id: `eq.${storyId}`,
                },
                headers: generateSupabaseHeaders(accessToken)
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
            narratorName: story.narrator_name
        })
    }

    static async getStories(filters = {
        narrator: "",
        language: "",
        ageGroups: [],
        storyLengths: [],
        private: false,
    }, { accessToken, userId, profileId, libraryId}) {
        // Prepare query parameters for filtering
        const queryParams = {
            select: '*,profiles!inner(*)',
        };

        let endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
        if (filters?.private && userId) {
            endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`
            queryParams.select = '*, stories (*, profiles (*))'
            queryParams.account_id = `eq.${userId}`
            queryParams.profile_id = `eq.${profileId}`
            queryParams["stories.deleted"] = `eq.false`
            queryParams.library_id = `eq.${libraryId}`
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
            headers: generateSupabaseHeaders(accessToken)
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

    static async findAll({ libraryId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: '*, stories (*, profiles (*))',
                library_id: `eq.${libraryId}`,
                ["stories.deleted"]: "eq.false"
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        const stories = response.data.map((storyLibrary) => {
            const story = storyLibrary.stories

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

        return stories
    }

    /**
     *
     * @param {boolean} isPublic
     * @param {string} title
     * @param {string} description
     * @param {string} narratorName
     * @param {string} accessToken
     * @returns {Promise<any>}
     */
    async update({
        isPublic,
        title,
        description,
        narratorName
    }, { accessToken }) {
        const payload = {}
        if (isPublic === false || isPublic === true) payload.is_public = isPublic
        if (title) payload.title = title
        if (description) payload.description = description
        if (narratorName) payload.narrator_name = narratorName

        if (Object.keys(payload).length === 0) throw new Error("Payload is missing")

        const response  = await axios.patch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`,
            payload, {
                params: {
                  story_id: `eq.${this.storyId}`
                },
                headers: generateSupabaseHeaders(accessToken)
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
