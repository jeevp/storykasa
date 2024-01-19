import StripeAccount from "../models/StripeAccount"
import Subscription from "../models/Subscription";

export default class WebhooksController {
    static async stripePaymentFailed(req, res) {
        try {
            if (req.body.type !== "invoice.payment_failed") {
                return res.status(401).send({ message: "Event type not allowed" })
            }
            console.log(">>>>>>>>>>>>>> OK 2")

            const stripeAccount = await StripeAccount.findOne({
                stripeCustomerId: req.body.data.object.customer
            }, { accessToken: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY })

            if (!stripeAccount) {
                console.log(">>>>>>>>> RETURN NULL")
                return res.status(404).send({ message: "Account not found" })
            }

            const subscription = await Subscription.findOne({
                accountId: stripeAccount.accountId
            }, { accessToken: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY })

            if (!subscription) {
                return res.status(404).send({ message: "Subscription not found" })
            }

            await subscription.update({
                subscriptionPlan: Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN
            }, { accessToken: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY })

            return res.status(201).send({ message: "Subscription downgraded with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
