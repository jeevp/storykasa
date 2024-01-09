const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)


class Customer {
    static async create({ email }) {
        const customer = await stripe.customers.create({
            email
        })

        return customer
    }
}

module.exports = Customer
