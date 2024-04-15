class Coupon {
    /**
     *
     * @param {'forever' | 'once' | 'repeating'} duration
     * @param {integer} durationInMonths
     * @param {float} percentOff
     * @returns {Promise<Stripe.Coupon & {lastResponse: {headers: {[p: string]: string}, requestId: string, statusCode: number, apiVersion?: string, idempotencyKey?: string, stripeAccount?: string}}>}
     */
    static async create({ duration, durationInMonths, percentOff }) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

        const allowedDurations = ["forever", "once", "repeating"]
        if (!allowedDurations.includes(duration)) {
            throw new Error("Duration needs to be forever, once or repeating")
        }

        return await stripe.coupons.create({
            duration,
            duration_in_months: durationInMonths,
            percent_off: percentOff
        })
    }
}

module.exports = Coupon
