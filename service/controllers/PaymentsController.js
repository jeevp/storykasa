import supabase from "../supabase";
import PromoCode from "../models/PromoCode";
const SubscriptionPlan = require("../models/SubscriptionPlan")
const StripeService = require("../services/StripeService/StripeService")
const StripeAccount = require("../models/StripeAccount")

export default class PaymentsController {
    static async createSetupIntent(req, res) {
        try {
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const stripeAccount = await StripeAccount.findOne({ accountId: user.id })

            const setupIntent = await StripeService.setupIntents.create({
                customerId: stripeAccount.stripeCustomerId
            })

            return res.status(200).send({ clientSecret: setupIntent.clientSecret })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async attachPaymentMethod(req, res) {
        try {
            const { paymentMethodId, promoCode } = req.body
            const {data: { user }} = await supabase.auth.getUser(req.accessToken)
            const stripeAccount = await StripeAccount.findOne({ accountId: user.id })

            await StripeService.customers.attachPaymentMethod({
                customerId: stripeAccount.stripeCustomerId
            }, {
                paymentMethodId
            })

            if (promoCode) {
                const promoCodeDetails = await PromoCode.findOne({ code: promoCode })

                if (!promoCodeDetails){
                    return res.status(400).send({ message: "Promo code not valid" })
                }

                await StripeService.customers.applyPromoCode({
                    customerId: stripeAccount.stripeCustomerId
                },{ promoCodeId: promoCodeDetails.stripePromoCodeId })
            }

            return res.status(200).send({ message: "Payment method attached with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
