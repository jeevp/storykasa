import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import {storyLengths} from "../../models/Story";

class StoryServiceHandler {
    static async getPublicStories(filters = {
        narrator: "",
        language: "",
        ageGroups: [],
        storyLengths: []
    }, { accessToken }) {
        // Prepare query parameters for filtering
        const queryParams = {
            select: '*,profiles!inner(*)',
            is_public: 'eq.true',
            order: 'last_updated.desc'
        };

        let ageGroups = filters.ageGroups
        if (!(ageGroups instanceof Array)) ageGroups = [filters.ageGroups]

        let storyLengths = filters.storyLengths
        if (!(storyLengths instanceof Array)) storyLengths = [filters.storyLengths]

        // Add filter for narrator if provided
        if (filters.narrator) {
            queryParams['profiles.profile_name'] = `eq.${filters.narrator}`;
        }

        // Add filter for language if provided
        if (filters.language) {
            queryParams['language'] = `eq.${filters.language}`;
        }

        // Add filter for ages if provided
        if (ageGroups && ageGroups.length) {
            queryParams['age_groups'] = `cs.{${ageGroups.join(',')}}`;
        }

        // Make the request to Supabase
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`, {
            params: queryParams,
            headers: generateSupabaseHeaders(accessToken)
        });

        let data = response.data;

        // Apply additional filtering for story lengths
        if (filters.storyLengths && filters.storyLengths.length) {
            data = data.filter(story => {
                if (filters.storyLengths.includes('short') && story.duration <= 300) {
                    return true;
                }
                if (filters.storyLengths.includes('medium') && story.duration > 300 && story.duration <= 600) {
                    return true;
                }
                if (filters.storyLengths.includes('long') && story.duration > 600) {
                    return true;
                }
                return false;
            });
        }

        return data;
    }

}

module.exports = StoryServiceHandler
