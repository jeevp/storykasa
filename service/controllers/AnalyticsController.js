const Account = require("../models/Account")
const Story = require("../models/Story")
const Subscription = require("../models/Subscription")
const Library = require("../models/Library")
const supabase = require("../supabase");
const PublicStoryRequest = require("../models/PublicStoryRequest");

class AnalyticsController {
    static async getAnalyticsOverview(req, res) {
        try {

            const accounts = await Account.findAll()
            const stories = await Story.findAll()

            let totalMinutesListened = 0
            let totalMinutesRecorded = 0
            let languages = new Set()
            stories.forEach((story) => {
                const minutesListened = story.playCount * (story.duration / 60)
                totalMinutesListened += minutesListened

                const minutesRecorded = story.duration / 60
                totalMinutesRecorded += minutesRecorded

                languages.add(story.language)
            })

            const analyticsOverview = {
                users: accounts?.length,
                totalMinutesListened: Math.ceil(totalMinutesListened),
                languages: languages.size,
                totalMinutesRecorded: Math.ceil(totalMinutesRecorded)
            }

            return res.status(200).send(analyticsOverview)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getUsersAnalytics(req, res) {
        try {
            const accounts = await Account.findAll()

            const analytics = {
                totalUsers: accounts?.length
            }

            return res.status(200).send(analytics)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSubscriptionsAnalytics(req, res) {
        try {
            const {
                FREE_SUBSCRIPTION_PLAN,
                PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
                PREMIUM_SUBSCRIPTION_PLAN,
                PREMIUM_PLUS_SUBSCRIPTION_PLAN
            } = Subscription.getAllowedSubscriptionPlanNames()
            const subscriptions = await Subscription.findAll()
            const freeSubscriptions = []
            const premiumSubscriptions = []
            const premiumPlusSubscriptions = []
            const organizationalSubscriptions = []

            subscriptions.forEach((subscription) => {
                switch(subscription.subscriptionPlan) {
                    case FREE_SUBSCRIPTION_PLAN:
                        freeSubscriptions.push(subscription)
                        break

                    case PREMIUM_PLUS_SUBSCRIPTION_PLAN:
                        premiumPlusSubscriptions.push(subscription)
                        break

                    case PREMIUM_SUBSCRIPTION_PLAN:
                        premiumSubscriptions.push(subscription)
                        break

                    case PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN:
                        organizationalSubscriptions.push(subscription)
                        break

                    default:
                        break
                }
            })

            const analytics = {
                totalFreeSubscriptions: freeSubscriptions?.length,
                totalPremiumSubscriptions: premiumSubscriptions?.length,
                totalPremiumPlusSubscriptions: premiumPlusSubscriptions?.length,
                totalOrganizationalSubscriptions: organizationalSubscriptions?.length
            }

            return res.status(200).send(analytics)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getStoriesAnalytics(req, res) {
        try {
            const stories = await Story.findAll()

            let totalMinutesListened = 0
            let totalMinutesRecorded = 0
            let languages = new Set()

            stories.forEach((story) => {
                const minutesListened = story.playCount * (story.duration / 60)
                totalMinutesListened += minutesListened

                const minutesRecorded = story.duration / 60
                totalMinutesRecorded += minutesRecorded

                languages.add(story.language)
            })

            return res.status(200).send({
                totalStories: stories?.length,
                totalMinutesListened: Math.ceil(totalMinutesListened),
                totalMinutesRecorded: Math.ceil(totalMinutesRecorded),
                totalLanguages: languages?.size
            })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getDiscoverAnalytics(req, res) {
        try {
            const stories = await Story.findAll()
            const publicStories = await stories.filter((story) => story.isPublic)
            const publicStoryRequests = await PublicStoryRequest.findAll({ storyIds: [] })

            const publicStoryRequestsStories = publicStoryRequests.map((request) => request.storyId)
            const uniqueStoryRequests = new Set(publicStoryRequestsStories)

            return res.status(200).send({
                totalPublicStories: publicStories?.length,
                totalStoriesSubmittedToPublicForSharing:uniqueStoryRequests?.size
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getCollectionsAnalytics(req, res) {
        try {
            const accounts = await Account.findAll()
            const idsToExclude = []

            await Promise.all(accounts.map(async(account) => {
                const defaultLibrary = await Library.findDefaultLibrary({ accountId: account?.accountId })
                idsToExclude.push(defaultLibrary?.libraryId)
            }))

            const allLibraries = await Library.findAll({}, { serialized: true })

            const collections = allLibraries.filter((library) => !idsToExclude.includes(library.libraryId))

            const privateCollections = collections.filter((collection) => collection.sharedAccountIds?.length === 0)
            const sharedCollections = collections.filter((collection) => collection.sharedAccountIds?.length > 0)

            const totalListeners = sharedCollections.reduce((sum, collection) => {
                return sum + collection.sharedAccountIds.length;
            }, 0)

            const totalStoriesAddedToCollections = sharedCollections.reduce((sum, collection) => {
                return sum + collection.totalStories
            }, 0)

            return res.status(200).send({
                totalCollections: collections?.length || 0,
                totalPrivateCollections: privateCollections?.length,
                totalSharedCollections: sharedCollections?.length,
                totalListeners,
                totalStoriesAddedToCollections
            })

        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}


module.exports = AnalyticsController
