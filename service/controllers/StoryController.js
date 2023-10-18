const supabase = require('../../service/supabase');
const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");

class StoryController {
    static async deleteStory(req, res) {
        try {
            const { storyId } = req.query

            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`, {
                params: {
                    story_id: `eq.${storyId}`
                },
                headers: generateSupabaseHeaders(req.accessToken)
            })

            return res.status(204).send(response.data)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getLibraryStories(req, res) {
        try {
            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
                params: {
                    select: '*,stories(*,profiles(*))',
                    account_id: `eq.${user?.id}`,
                    order: "created_at.desc"
                },
                headers: generateSupabaseHeaders(req.accessToken)
            })

            const stories = response.data?.map((story) => story.stories)
            return res.status(200).send(stories)
        } catch (error) {
            console.error(error)
            res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getDiscoverStories(req, res) {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`, {
                params: {
                    select: '*,profiles(*)',
                    is_public: 'eq.true',
                    order: 'last_updated.desc'
                },
                headers: generateSupabaseHeaders(req.accessToken)
            })

            return res.status(200).send(response.data)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async createStory(req, res) {
        try {
            const {
                title,
                description,
                isPublic,
                recordedBy,
                language,
                ageGroup,
                recordingURL,
                duration,
                illustrationsURL
            } = req.body

            const newStory = {
                is_public: isPublic,
                title: title,
                recorded_by: recordedBy,
                recording_url: recordingURL,
                description: description,
                language: language,
                age_group: ageGroup,
                duration: duration
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories`,
                newStory,
                {
                    params: {
                        select: '*'
                    },
                    headers: generateSupabaseHeaders(req.accessToken)
                }
            )

            let newStoryID = response.data[0].story_id

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            // simulate the story "saving" process by adding it to the library_stories table
            if (newStoryID && user) {
                const libraryResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
                        params: {
                            select: "*",
                            "account_id": `eq.${user?.id}`
                        },
                        headers: generateSupabaseHeaders(req.accessToken)
                    }
                )

                const storyResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`,
                    {
                        account_id: user.id,
                        story_id: newStoryID,
                        library_id: libraryResponse?.data[0]?.library_id
                    },
                    {
                        params: {
                            select: '*'
                        },
                        headers: generateSupabaseHeaders(req.accessToken)
                    }
                )

                const createdStory = response.data[0]

                // Let's add the illustrations
                illustrationsURL.map(async(illustrationURL) => {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/stories_images`,
                        {
                            image_url: illustrationURL,
                            story_id: createdStory?.story_id
                        },
                        {
                            params: {
                                select: '*'
                            },
                            headers: generateSupabaseHeaders(req.accessToken)
                        }
                    )
                })

            }

            return res.status(201).send({ message: "Story created with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = StoryController
