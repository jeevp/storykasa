import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

class StoryServiceHandler {
    static async getStories(filters = {
        narrator: "",
        language: "",
        ageGroups: [],
        storyLengths: [],
        private: false
    }, { accessToken, userId }) {
        // Prepare query parameters for filtering
        const queryParams = {
            select: '*,profiles!inner(*)',
        };

        let endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`
        if (filters?.private && userId) {
            endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`
            queryParams.select = '*, stories (*, profiles (*))'
        } else {
            queryParams.is_public = "eq.true"
            queryParams.order = 'last_updated.desc'
        }

        let ageGroups = filters?.ageGroups
        if (ageGroups && !(ageGroups instanceof Array)) ageGroups = [filters?.ageGroups]

        // Add filter for narrator if provided
        if (!filters.private && filters?.narrator) {
            queryParams['profiles.profile_name'] = `eq.${filters?.narrator}`;
        }

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

        if (filters?.private) data = response.data?.map((story) => story.stories)

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

        if (filters?.private && filters.narrator) {
            data = data.filter(story => {
                if (!story?.profiles) return false

                return story?.profiles?.profile_name === filters.narrator
            });
        }

        return data.filter((d) => d !== null).sort((a, b) => {
            if (a.created_at < b.created_at) return 1
            if (a.created_at > b.created_at) return -1
        });
    }

}

module.exports = StoryServiceHandler
