import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

export default class PromoCode {
    constructor({
        id,
        createdAt,
        discountPercentage,
        durationInMonths,
        duration,
        isValid,
        code,
        stripePromoCodeId
    }) {
        this.id = id
        this.createdAt = createdAt
        this.discountPercentage = discountPercentage
        this.durationInMonths = durationInMonths
        this.duration = duration
        this.isValid = isValid
        this.code = code
        this.stripePromoCodeId = stripePromoCodeId
    }

    static async create({
        discountPercentage,
        duration,
        durationInMonths,
        stripePromoCodeId,
        code
    }) {

        const response = await axios.post(
            `${process.env.SUPABASE_URL}/rest/v1/promo_codes`,
            {
                discount_percentage: discountPercentage,
                duration_in_months: durationInMonths,
                duration,
                code,
                is_valid: true,
                stripe_promo_code_id: stripePromoCodeId
            },
            {
                headers: generateSupabaseHeaders()
            }
        )

        const promoCode = response.data[0]

        return new PromoCode({
            id: promoCode.id,
            createdAt: promoCode.created_at,
            discountPercentage: promoCode.discount_percentage,
            durationInMonths: promoCode.duration_in_months,
            duration: promoCode.duration,
            isValid: promoCode.is_valid,
            stripePromoCodeId: promoCode.stripe_promo_code_id,
            code: promoCode.code
        })
    }

    static async findAll() {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/promo_codes`,
            {
                params: {
                    select: "*"
                },
                headers: generateSupabaseHeaders()
            }
        )

        return response.data.map((promoCode) => new PromoCode({
            id: promoCode.id,
            createdAt: promoCode.created_at,
            discountPercentage: promoCode.discount_percentage,
            durationInMonths: promoCode.duration_in_months,
            duration: promoCode.duration,
            isValid: promoCode.is_valid,
            stripePromoCodeId: promoCode.stripe_promo_code_id,
            code: promoCode.code
        }))
    }

    static async findOne({ code }) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/promo_codes`,
            {
                params: {
                    select: "*",
                    code: `eq.${code}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        if (!response.data[0]) return null

        const promoCode = response.data[0]

        return new PromoCode({
            id: promoCode.id,
            createdAt: promoCode.created_at,
            discountPercentage: promoCode.discount_percentage,
            durationInMonths: promoCode.duration_in_months,
            duration: promoCode.duration,
            isValid: promoCode.is_valid,
            stripePromoCodeId: promoCode.stripe_promo_code_id,
            code: promoCode.code
        })
    }
}
