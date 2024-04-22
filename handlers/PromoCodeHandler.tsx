import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";
import { STK_ACCESS_TOKEN } from "@/config";
import Profile from "@/models/Profile";
import PromoCode from "@/models/PromoCode";

export default class PromoCodeHandler {
  static async fetchPromoCodes() {
    const headers = generateHeaders();
    const response = await axios.get("/api/admin/promo-codes", headers);
    // @ts-ignore
    return response.data.map((promoCode: PromoCode) => new PromoCode({
      ...promoCode
    }));
  }

  static async createPromoCode({ discountPercentage, duration, durationInMonths }: {
    discountPercentage: number,
    duration: 'once' | 'forever' | 'repeating',
    durationInMonths: number
  }) {
    const headers = generateHeaders();
    const payload = {
      discountPercentage,
      duration,
    };

    // @ts-ignore
    if (duration === "repeating") payload.durationInMonths = durationInMonths

      const response = await axios.post(`/api/admin/promo-codes`, payload, headers);

    return new PromoCode({
      id: response.data.id,
      createdAt: response.data.createdAt,
      discountPercentage: response.data.discountPercentage,
      durationInMonths: response.data.durationInMonths,
      duration: response.data.duration,
      isValid: response.data.isValid,
      code: response.data.code,
      stripePromoCodeId: response.data.stripePromoCodeId,
    });
  }

  static async updateProfile(
    { profileId }: { profileId: string },
    { name, avatarUrl }: { name: string; avatarUrl: string }
  ) {
    const headers = generateHeaders();
    const payload = {};
    // @ts-ignore
    if (name) payload.name = name;
    // @ts-ignore
    if (avatarUrl) payload.avatarUrl = avatarUrl;

    const response = await axios.put(`/api/profiles/${profileId}`, payload, headers);

    return response.data;
  }

  static async validatePromoCode(promoCode: string) {
    const headers = generateHeaders();
    const payload = { promoCode }

    const response = await axios.post("/api/promo-codes/validate-promo-code",payload, headers);

    // @ts-ignore
    return new PromoCode({
      code: response.data.code,
      isValid: response.data.isValid,
      discountPercentage: response.data.discountPercentage,
      durationInMonths: response.data.durationInMonths,
      duration: response.data.duration
    })
  }
}
