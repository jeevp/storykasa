import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

class TermsAndPrivacyConsent {
    constructor({
        id,
        userId,
        userIP,
        browserName,
        browserVersion,
        termsAgreed
    }) {
        this.id = id
        this.userId = userId
        this.userIP = userId
        this.browserName = browserName
        this.browserVersion = browserVersion
        this.termsAgreed = termsAgreed
    }

    static async create({
        userId,
        userIP,
        browserName,
        browserVersion,
        termsAgreed
    }){
        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/terms_and_privacy_consents`, {
            user_id: userId,
            user_ip: userIP,
            browser_name: browserName,
            browser_version: browserVersion,
            terms_agreed: termsAgreed
        }, {
            headers: generateSupabaseHeaders()
        })

        return response.data
    }
}

module.exports = TermsAndPrivacyConsent
