const StripeService = require("../StripeService")

class Subscription extends StripeService {
    /**
     *
     * @param {string} customerId
     * @param {string} planId
     */
    static async create({ customerId, planId }) {
        const subscription = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ plan: planId }],
            expand: ['latest_invoice.payment_intent']
        })

        return subscription
    }
}

module.exports = Subscription
