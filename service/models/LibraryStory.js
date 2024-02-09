const axios = require("axios")
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
import Story from "../models/Story"

class LibraryStory {
    constructor({
        id,
        createdAt,
        storyId,
        profileId,
        libraryId
    }) {
        this.id = id
        this.createdAt = createdAt
        this.storyId = storyId
        this.profileId = profileId
        this.libraryId = libraryId
    }

    static async create({ storyId, profileId, accountId, libraryId }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            story_id: storyId,
            profile_id: profileId,
            account_id: accountId,
            library_id: libraryId
        },
        {
            params: {
                select: '*'
            },
            headers: generateSupabaseHeaders()
        })


        return response.data
    }

    static async delete({ storyId, profileId, libraryId, accountId }) {
        if (!storyId || !profileId || !accountId) {
            throw new Error("storyId and profileId cannot be null")
        }

        const response = await axios.delete(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                story_id: `eq.${storyId}`,
                library_id: `eq.${libraryId}`,
                profile_id: `eq.${profileId}`,
                account_id: `eq.${accountId}`
            },
            headers: generateSupabaseHeaders()
        })

        return response.data
    }

    static async findOne({ libraryId, storyId }) {
        if (!libraryId || !storyId) {
            throw new Error("libraryId and storyId cannot be null")
        }

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`,
                story_id: `eq.${storyId}`
            },
            headers: generateSupabaseHeaders()
        })

        const libraryStory =  response.data[0]

        if (!libraryStory) return null

        return new LibraryStory({
            id: libraryStory?.id,
            createdAt: libraryStory?.created_at,
            storyId: libraryStory?.story_id,
            profileId: libraryStory?.profile_id,
            libraryId: libraryStory?.library_id
        })
    }

    static async findAll({ libraryId }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: '*, stories (*, profiles (*))',
                library_id: `eq.${libraryId}`,
                ["stories.deleted"]: "eq.false"
            },
            headers: generateSupabaseHeaders()
        })

        return response.data.map((storyLibrary) => {
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
                profileAvatar: story?.profiles?.avatar_url,
                playCount: story?.play_count
            })
        })
    }
}

module.exports = LibraryStory
