import axios from "axios";
import generateSupabaseHeaders from "../service/utils/generateSupabaseHeaders"

interface PromoCodeTransactionProps {
  id?: number
  createdAt?: string
  promoCodeId: number
  startDate: number
  endDate: string
  accountId: string
}

export default class PromoCodeTransaction {
  id?: number
  createdAt?: string
  promoCodeId: number
  startDate: number
  endDate: string
  accountId: string

  constructor({
    id,
    createdAt,
    promoCodeId,
    startDate,
    endDate,
    accountId
  }: PromoCodeTransactionProps) {
    this.id = id
    this.createdAt = createdAt
    this.promoCodeId = promoCodeId
    this.startDate = startDate
    this.startDate = startDate
    this.endDate = endDate
    this.accountId = accountId
  }

  static async create(attributes: {
    accountId: string
    promoCodeId: number
    startDate: string
    endDate: string
  }) {
    const response = await axios.post(
        `${process.env.SUPABASE_URL}/rest/v1/promo_codes`,
        {
          account_id: attributes.accountId,
          promoCodeId: attributes.promoCodeId,
          start_date: attributes.startDate,
          end_date: attributes.endDate
        },
        {
          headers: generateSupabaseHeaders()
        }
    )

    const promoCodeTransaction = response.data[0]

    return new PromoCodeTransaction({
      id: promoCodeTransaction.id,
      createdAt: promoCodeTransaction.created_at,
      promoCodeId: promoCodeTransaction.promo_code_id,
      startDate: promoCodeTransaction.start_date,
      endDate: promoCodeTransaction.end_date,
      accountId: promoCodeTransaction.account_id
    })
  }
}
