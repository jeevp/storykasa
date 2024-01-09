const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

class Subscription {
    /**
     *
     * @param {string} customerId
     * @param {string} planId
     */
    static async create({ customerId, planId }) {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ plan: planId }],
            expand: ['latest_invoice.payment_intent']
        })

        return subscription
    }
}

module.exports = Subscription
