import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";


export default class StoryIdeasHandler {
    static async generateStoryIdea({ profileId }: { profileId: string }, {
        isFictional,
        language,
        ageGroups,
        description
    }: {
        isFictional: boolean,
        language: string,
        ageGroups: string,
        description: string
    }) {
        const headers = generateHeaders()

        const response = await axios.post(`/api/profiles/${profileId}/storyIdeas`, {
            isFictional,
            language,
            ageGroups,
            description
        }, headers)

        // @ts-ignore
        const fullDescription =  `${response.data.setting}\n\nCharacters:\n${response?.data?.characters.map(character => `• ${character.name}: ${character.description}`).join('\n')}`;

        return {
            ...response.data,
            fullDescription
        }
    }

    static async fetchStoryIdeas({ profileId }: { profileId: string }) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/profiles/${profileId}/storyIdeas`, headers)

        return response.data
    }
}
