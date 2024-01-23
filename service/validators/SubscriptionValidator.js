const Profile = require( "../models/Profile")
const supabase =  require("../supabase")
const Subscription = require("../models/Subscription")
const Story = require("../models/Story")
const Account = require("../models/Account")

class SubscriptionValidator {
    static async validateMaxProfiles(accessToken) {
        const profiles = await Profile.getAccountProfiles({ accessToken })
        const { data: { user }} = await supabase.auth.getUser(accessToken)

        const subscription = await Subscription.findOne({ accountId: user.id }, {
            accessToken
        })

        const { maxProfilesAllowed} = subscription

        if (!maxProfilesAllowed) return true

        return profiles.length < maxProfilesAllowed
    }

    static async validateMaxStoriesRecordingTime({ accountId }) {
        const subscription = await Subscription.findOne({ accountId })
        if (!subscription) return false

        const defaultLibrary = Account.getDefaultProfile({ accountId })

        const stories = await Story.findAll({ libraryId: defaultLibrary.libraryId })

        const totalStoriesDuration = stories.reduce((accumulator, currentStory) => {
            return accumulator + currentStory.duration
        }, 0)

        const { maxStoriesDurationTimeAllowed } = subscription

        return totalStoriesDuration < maxStoriesDurationTimeAllowed
    }
}


module.exports = SubscriptionValidator
