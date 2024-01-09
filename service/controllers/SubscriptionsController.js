import supabase from "../supabase";
const SubscriptionPlan = require("../models/SubscriptionPlan")
const StripeService = require("../services/StripeService/StripeService")

export default class SubscriptionsController {
    static async updateSubscriptionPlan(req, res) {
        try {
            const { subscriptionPlan } = req.body

            const subscriptionPlanAmount = SubscriptionPlan.getSubscriptionPlanAmount(subscriptionPlan)

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const paymentIntent = await StripeService.paymentIntents.create({
                amount: subscriptionPlanAmount * 100,
                payment_method_types: ["card"]
            })

            return res.status(200).send({ clientSecret: paymentIntent.clientSecret })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
