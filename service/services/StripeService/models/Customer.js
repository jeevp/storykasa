const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)


class Customer {
    static async create({ email }) {
        const customer = await stripe.customers.create({
            email
        })

        return customer
    }

    static async attachPaymentMethod({ customerId }, { paymentMethodId }) {
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        })

        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
    }
}

module.exports = Customer
