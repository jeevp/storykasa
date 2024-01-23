const supabase = require("../supabase")
const Subscription = require("../models/Subscription")
const SubscriptionPlan = require("../models/SubscriptionPlan")
const StripeService = require("../services/StripeService/StripeService")
const StripeAccount = require("../models/StripeAccount")

export default class SubscriptionsController {
    static async updateSubscriptionPlan(req, res) {
        try {
            const { subscriptionPlan } = req.body

            const stripeSubscriptionPriceId = SubscriptionPlan.getStripeSubscriptionPriceId(subscriptionPlan)

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const stripeAccount = await StripeAccount.findOne({ accountId: user.id }, {
                accessToken: req.accessToken
            })

            await StripeService.subscriptions.update({
                subscriptionId: stripeAccount.stripeSubscriptionId
            }, {
                priceId: stripeSubscriptionPriceId
            })

            const subscription = await Subscription.findOne({ accountId: user.id })
            const updatedSubscription = await subscription.update({ subscriptionPlan })

            const subscriptionSerialized = updatedSubscription.serializer()

            return res.status(200).send(subscriptionSerialized)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSubscription(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const subscription = await Subscription.findOne({ accountId: user.id }, {
                accessToken: req.accessToken
            })

            const subscriptionSerialized = subscription.serializer()
            return res.status(200).send(subscriptionSerialized)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async createSetupIntent(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const stripeAccount = await StripeAccount.findOne({ accountId: user.id }, {
                accessToken: req.accessToken
            })

            const setupIntent = await StripeService.setupIntents.create({
                customerId: stripeAccount.stripeCustomerId
            })

            return res.status(200).send({ clientSecret: setupIntent.clientSecret })
        } catch (error) {
            return res.status(400)
        }
    }
}
