import StripeAccount from "../models/StripeAccount"
import Subscription from "../models/Subscription";

export default class WebhooksController {
    static async stripePaymentFailed(req, res) {
        try {
            if (req.body.type !== "invoice.payment_failed") {
                return res.status(401).send({ message: "Event type not allowed" })
            }

            const stripeAccount = await StripeAccount.findOne({
                stripeCustomerId: req.body.data.object.customer
            })

            if (!stripeAccount) {
                return res.status(404).send({ message: "Account not found" })
            }

            const subscription = await Subscription.findOne({
                accountId: stripeAccount.accountId
            })

            if (!subscription) {
                return res.status(404).send({ message: "Subscription not found" })
            }

            await subscription.update({
                subscriptionPlan: Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN
            })

            return res.status(201).send({ message: "Subscription downgraded with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
