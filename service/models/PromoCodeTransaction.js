import axios from "axios";
import { DateTime } from "luxon"
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders"

export default class PromoCodeTransaction {
  constructor({
    id,
    createdAt,
    promoCodeId,
    startDate,
    endDate,
    accountId
  }) {
    this.id = id
    this.createdAt = createdAt
    this.promoCodeId = promoCodeId
    this.startDate = startDate
    this.endDate = endDate
    this.accountId = accountId
  }

  static async create({
    accountId,
    promoCodeId,
    startDate,
    endDate,
  }) {
    if (!accountId || !promoCodeId || !startDate || !endDate) {
      throw new Error("Payload is incorrect.")
    }

    const response = await axios.post(
        `${process.env.SUPABASE_URL}/rest/v1/promo_code_transactions`,
        {
          account_id: accountId,
          promoCodeId: promoCodeId,
          start_date: startDate,
          end_date: endDate
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

  static async findAllOngoingTransactions() {
    const now = DateTime.now().toISO()

    const response = await axios.get(
        `${process.env.SUPABASE_URL}/rest/v1/promo_code_transactions`,
        {
          headers: generateSupabaseHeaders(),
          params: {
            select: "*",
            start_date: `lte.${now}`,
            end_date: `gte.${now}`
          }
        }
    );
    console.log('Response data:', response.data);

    return response.data.map((promoCodeTransaction) => new PromoCodeTransaction({
      id: promoCodeTransaction.id,
      createdAt: promoCodeTransaction.created_at,
      promoCodeId: promoCodeTransaction.promo_code_id,
      startDate: promoCodeTransaction.start_date,
      endDate: promoCodeTransaction.end_date,
      accountId: promoCodeTransaction.account_id
    }))
  }
}
