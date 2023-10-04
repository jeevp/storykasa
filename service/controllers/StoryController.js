const supabase = require('../../service/supabase');

class StoryController {
    static async deleteStory(req, res) {
        try {
            const { storyId } = req.params

            await supabase.from('stories').delete().eq('story_id', storyId)

            return res.status(204).send({ message: "Story deleted with success" })
        } catch (error) {
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
}


module.exports.default = StoryController
