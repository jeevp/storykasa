const supabase = require('../../service/supabase');

class ProfileController {
    static async getProfiles(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)
            console.log({ userId: user.id })

            const userId = user.id
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .eq('account_id', "244f51a1-a747-412f-9e72-2deae08b3cc9")

            return res.status(200).send(profiles)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
    static async createProfile(req, res) {
        try {
            const { name, avatarUrl } = req.body

            if (!name) {
                return res.status(400).send({
                    message: "Cannot add a profile without a name."
                })
            }

            const { data: { user }} = await supabase.auth.getUser(req.accessToken)

            if (!user) return res.status(404).send({
                message: "User not found"
            })

            const attributes = {
                account_id: user.id,
                profile_name: name
            }

            if (avatarUrl) attributes.avatar_url = avatarUrl

            const { data, error } = await supabase
                .from('profiles')
                .insert(attributes)
                .select()

            const createdProfile = data[0]

            return res.status(201).send(createdProfile.id)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updateProfile(req, res) {
        try {
            const { profileId } = req.params

            if (!profileId) {
                return res.status(400).send({ message: "Missing params." })
            }

            const attributesToBeUpdated = {}
            const { name, avatarUrl } = req.body
            if (name) attributesToBeUpdated.profile_name = name
            if (avatarUrl) attributesToBeUpdated.avatar_url = avatarUrl

            await supabase.from("profiles")
                .update(attributesToBeUpdated)
                .eq("profile_id", profileId)
                .select()

            return res.status(202).send({ message: `Profile with ID ${profileId} was updated with success` })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}

module.exports = ProfileController
