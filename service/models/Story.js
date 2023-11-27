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
        ageGroup,
        recordingUrl,
        recordedBy,
        duration,
        ageGroups,
        profileName,
        profileAvatar
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
        this.ageGroup = ageGroup
        this.recordingUrl = recordingUrl
        this.recordedBy = recordedBy
        this.duration = duration
        this.ageGroups = ageGroups
        this.profileName = profileName
        this.profileAvatar = profileAvatar
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
            ageGroups: story.age_groups
        })
    }

    async update({ isPublic }, { accessToken }) {
        const response  = await axios.patch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`,
            {
                is_public: isPublic
            }, {
                params: {
                  story_id: `eq.${this.storyId}`
                },
                headers: generateSupabaseHeaders(accessToken)
            }
        )
    }
}

module.exports = Story
