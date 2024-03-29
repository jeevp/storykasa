const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentIntent {
    static async create({ amount }) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd"
        })

        return {
            clientSecret: paymentIntent.client_secret
        }
    }
}

module.exports = PaymentIntent
