const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

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

    static async findOne({ subscriptionId }) {
        return await stripe.subscriptions.retrieve(subscriptionId)
    }

    static async update({ subscriptionId }, { priceId }) {
        const subscription = await Subscription.findOne({ subscriptionId })

        return await stripe.subscriptions.update(subscriptionId, {
            items: [{id: subscription.items.data[0].id, price: priceId}]
        })
    }





}

module.exports = Subscription
