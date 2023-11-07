const supabase = require('../../service/supabase');
const generateSupabaseHeaders = require("../../service/utils/generateSupabaseHeaders")
const axios = require("axios");
const ProfileServiceHandler = require("../handlers/ProfileServiceHandler");
const ProfileValidator = require("../validators/ProfileValidator")

class ProfileController {
    static async getProfiles(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const userId = user.id

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`,
                {
                    params: {
                        select: "*",
                        account_id: `eq.${userId}`
                    },
                    headers: generateSupabaseHeaders(req.accessToken)
                }
            )

            return res.status(200).send(response.data)
        } catch (error) {
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

            await ProfileValidator.validateMaxProfiles(req, res)

            const profile = await ProfileServiceHandler.createProfile({
                name, avatarUrl
            }, { accessToken: req.accessToken })

            return res.status(201).send(profile)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updateProfile(req, res) {
        try {
            const { profileId } = req.query

            if (!profileId) {
                return res.status(400).send({ message: "Missing params." })
            }

            const attributesToBeUpdated = {}
            const { name, avatarUrl } = req.body
            if (name) attributesToBeUpdated.profile_name = name
            if (avatarUrl) attributesToBeUpdated.avatar_url = avatarUrl

            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles`, attributesToBeUpdated, {
                    params: {
                        profile_id: `eq.${profileId}`,
                        select: '*'
                    },
                    headers: generateSupabaseHeaders(req.accessToken)
                }
            )

            return res.status(202).send(response.data)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}

module.exports = ProfileController
