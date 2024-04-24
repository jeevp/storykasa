interface PromoCodeProps {
  id: number;
  createdAt: string;
  discountPercentage: number;
  durationInMonths: number;
  duration: "once" | "forever" | "repeating";
  isValid: boolean;
  code: string;
  stripePromoCodeId: string;
  unlimitedUsage?: boolean
}

export default class PromoCode {
  id?: number;
  createdAt?: string;
  discountPercentage: number;
  durationInMonths: number;
  duration: "once" | "forever" | "repeating";
  isValid: boolean;
  code: string;
  stripePromoCodeId?: string;
  unlimitedUsage?: boolean

  constructor({
    id,
    createdAt,
    discountPercentage,
    durationInMonths,
    duration,
    isValid,
    code,
    stripePromoCodeId,
    unlimitedUsage
  }: PromoCodeProps) {
    this.id = id;
    this.createdAt = createdAt;
    this.discountPercentage = discountPercentage;
    this.durationInMonths = durationInMonths;
    this.duration = duration;
    this.isValid = isValid;
    this.code = code;
    this.stripePromoCodeId = stripePromoCodeId;
    this.unlimitedUsage = unlimitedUsage
  }
}
