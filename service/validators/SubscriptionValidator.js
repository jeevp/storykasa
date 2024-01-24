const Profile = require( "../models/Profile")
const supabase =  require("../supabase")
const Subscription = require("../models/Subscription")
import Library from "../models/Library"


class SubscriptionValidator {
    static async validateMaxProfiles(accessToken) {
        const profiles = await Profile.getAccountProfiles({ accessToken })
        const { data: { user }} = await supabase.auth.getUser(accessToken)

        const subscription = await Subscription.findOne({ accountId: user.id }    )

        const { maxProfilesAllowed} = subscription

        if (!maxProfilesAllowed) return true

        return profiles.length < maxProfilesAllowed
    }

    static async validateMaxStoriesRecordingTime({ accountId }) {
        const subscription = await Subscription.findOne({ accountId })
        if (!subscription) return false

        const totalStoriesDuration = await Library.getTotalRecordingTime({ accountId })

        const { maxRecordingTimeAllowed } = subscription

        return totalStoriesDuration < maxRecordingTimeAllowed
    }
}


module.exports = SubscriptionValidator
