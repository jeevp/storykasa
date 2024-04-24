import APIValidator from "../validators/APIValidator"
import PromoCode from "../models/PromoCode";
const StripeService = require("../services/StripeService/StripeService")

export default class PromoCodesController {
    static async createPromoCode(req, res) {
        try {
            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["discountPercentage", "duration"]
            })

            const { duration, discountPercentage, durationInMonths, unlimitedUsage } = req.body

            if (duration === "repeating" && !durationInMonths) {
                return res.status(400).send({ message: "Payload is incorrect" })
            }

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
                code: stripePromoCode.code,
                unlimitedUsage
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

    static async validatePromoCode(req, res) {
        try {
            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["promoCode"]
            })

            const promoCode = await PromoCode.findOne({ code: req.body.promoCode })
            if (!promoCode || !promoCode?.isValid) {
                return res.status(201).send(new PromoCode({
                    code: req.body.promoCode,
                    isValid: false
                }))
            }


            return res.status(201).send(new PromoCode({
                code: promoCode.code,
                isValid: promoCode.isValid,
                discountPercentage: promoCode.discountPercentage,
                durationInMonths: promoCode.durationInMonths,
                duration: promoCode.duration,
                unlimitedUsage: promoCode.unlimitedUsage
            }))
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}
