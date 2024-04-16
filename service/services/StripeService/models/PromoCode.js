class PromoCode {
    static async create({ couponId }) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        return await stripe.promotionCodes.create({
            coupon: couponId
        })
    }
}

module.exports = PromoCode
