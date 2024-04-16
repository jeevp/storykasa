import axios from "axios";
import generateHeaders from "@/handlers/generateHeaders";
import { STK_ACCESS_TOKEN } from "@/config";
import Profile from "@/models/Profile";
import PromoCode from "@/models/PromoCode";

export default class PromoCodeHandler {
  static async fetchPromoCodes() {
    const headers = generateHeaders();
    try {
      const response = await axios.get("/api/admin/promo-codes", headers);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async createPromoCode(promoCode: any) {
    console.log({ promoCode });

    const headers = generateHeaders();
    console.log(headers);
    const payload = {
      discountPercentage: promoCode?.discountPercentage,
      duration: promoCode.duration,
      durationInMonths: promoCode?.durationInMonths,
    };

    console.log({ payload });

    try {
        console.log("okay 1")
      const response = await axios.post(`/api/admin/promo-codes`, payload, headers);
      console.log("okay 2")

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
    } catch (error) {
      console.log(error);
    }
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
}
