import PromoCode from "../models/PromoCode";

const supabase = require("../supabase")
const Subscription = require("../models/Subscription")
const SubscriptionPlan = require("../models/SubscriptionPlan")
const StripeService = require("../services/StripeService/StripeService")
const StripeAccount = require("../models/StripeAccount")
const Account = require("../models/Account")

export default class SubscriptionsController {
    static async updateSubscriptionPlan(req, res) {
        try {
            const { subscriptionPlan, promoCode } = req.body

            let stripePromoCodeId = null
            if (promoCode) {
                const _promoCode = await PromoCode.findOne({ code: promoCode })
                stripePromoCodeId = _promoCode.stripePromoCodeId
            }

            const stripeSubscriptionPriceId = SubscriptionPlan.getStripeSubscriptionPriceId(subscriptionPlan)

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const stripeAccount = await StripeAccount.findOne({ accountId: user.id })

            await StripeService.subscriptions.update({
                subscriptionId: stripeAccount.stripeSubscriptionId
            }, {
                priceId: stripeSubscriptionPriceId,
                stripePromoCodeId
            })

            const subscription = await Subscription.findOne({ accountId: user.id })
            const updatedSubscription = await subscription.update({ subscriptionPlan })

            const subscriptionSerialized = updatedSubscription.serializer()

            return res.status(200).send({
                ...subscriptionSerialized,
                adminAccount: Account.getAdminAccounts().includes(user.email)
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async getSubscription(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const subscription = await Subscription.findOne({ accountId: user.id })

            const subscriptionSerialized = subscription.serializer()
            return res.status(200).send({
                ...subscriptionSerialized,
                adminAccount: Account.getAdminAccounts().includes(user.email)
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async createSetupIntent(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const stripeAccount = await StripeAccount.findOne({ accountId: user.id })

            const setupIntent = await StripeService.setupIntents.create({
                customerId: stripeAccount.stripeCustomerId
            })

            return res.status(200).send({ clientSecret: setupIntent.clientSecret })
        } catch (error) {
            return res.status(400)
        }
    }
}
