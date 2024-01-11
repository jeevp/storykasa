import supabase from "../supabase";
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

            const setupIntent = await StripeService.setupIntents.create({
                customerId: stripeAccount.stripeCustomerId
            })

            return res.status(200).send({ clientSecret: setupIntent.clientSecret })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
