import APIValidator from "../validators/APIValidator"
import PromoCode from "../models/PromoCode";
const StripeService = require("../services/StripeService/StripeService")

export default class PromoCodesController {
    static async createPromoCode(req, res) {
        try {
            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["discountPercentage", "duration", "durationInMonths"]
            })

            const { duration, discountPercentage, durationInMonths } = req.body

            const stripeCoupon = await StripeService.coupons.create({
                duration,
                durationInMonths,
                percentOff: discountPercentage
            })

            const stripePromoCode = await StripeService.promoCodes.create({ couponId: stripeCoupon.id })

            const promoCode = await PromoCode.create({
                discountPercentage,
                duration,
                durationInMonths,
                stripePromoCodeId: stripePromoCode.id,
                code: stripePromoCode.code
            })

            return res.status(201).send(promoCode)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getPromoCodes(req, res) {
        try {
            const promoCodes = await PromoCode.findAll()

            return res.status(201).send(promoCodes)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}
