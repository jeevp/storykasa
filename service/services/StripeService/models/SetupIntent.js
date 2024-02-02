const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class SetupIntent {
    static async create({
        customerId
    }) {
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId
        })

        return {
            clientSecret: setupIntent.client_secret
        }
    }
}


module.exports = SetupIntent
