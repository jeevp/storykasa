const StripeService = require("../StripeService")

class Customer extends StripeService {
    static async create({ email }) {
        const customer = await this.stripe.customers.create({
            email
        })

        return customer
    }
}

module.exports = Customer
