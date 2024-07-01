

class Customer {
    static async create({ email }) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        const customer = await stripe.customers.create({
            email
        })

        return customer
    }

    static async attachPaymentMethod({ customerId }, { paymentMethodId }) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        })

        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
    }

    static async applyPromoCode({ customerId }, { promoCodeId }) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        await stripe.customers.update(customerId, {
            promotion_codes: [promoCodeId],
        });
    }
}

module.exports = Customer
