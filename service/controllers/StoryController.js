const supabase = require('../../service/supabase');

class StoryController {
    static async deleteStory(req, res) {
        try {
            const { storyId } = req.query

            await supabase.from('stories').delete().eq('story_id', storyId)

            return res.status(204).send({ message: "Story deleted with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getLibraryStories(req, res) {
        try {
            const { data: { user } } = await supabase.auth.getUser(req.accessToken)
            const { data } = await supabase
                .from('library_stories')
                .select('*, stories (*, profiles (*))')
                .eq('account_id', user?.id)
                .order('stories(last_updated)', { ascending: false })

            const stories = data?.map((story) => story.stories)
            return res.status(200).send(stories)
        } catch (error) {
            res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getDiscoverStories(req, res) {
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('*, profiles (*)')
                .eq('is_public', true)
                .order('last_updated', { ascending: false })

            return res.status(200).send(data)
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
                duration
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

            const { data, error } = await supabase
                .from('stories')
                .insert(newStory)
                .select()


            let newStoryID = data[0].story_id

            const {data: { user }} = await supabase.auth.getUser()

            // simulate the story "saving" process by adding it to the library_stories table
            if (data && user) {
                const { data, error } = await supabase
                    .from('accounts')
                    .select('*, libraries(*)')
                    .eq('account_id', user.id)

                if (error) console.log(error)
                await supabase.from('library_stories').insert({
                    account_id: user.id,
                    story_id: newStoryID,
                    library_id: data[0].libraries[0].library_id
                })
            }

            return res.status(201).send({ message: "Story created with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = StoryController
