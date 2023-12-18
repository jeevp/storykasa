import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import axios from "axios";

export default class Library {
    /**
     *
     * @param {string} accountId
     * @param {string} libraryId
     * @param {string} libraryName
     * @param {string[]} sharedAccountIds
     */
    constructor({
        accountId,
        libraryId,
        libraryName,
        sharedAccountIds = []
    }) {
        this.accountId = accountId
        this.libraryId = libraryId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
    }


    /**
     *
     * @param {string} libraryName
     * @param {string} accountId
     * @param {string} accessToken
     * @returns {Promise<Library>}
     */
    static async create({
        libraryName,
        accountId
    }, { accessToken }) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            account_id: accountId,
            library_name: libraryName
        }, {
            params: {
               select: "*"
            },
            headers: generateSupabaseHeaders(accessToken)
        })


        return new Library({
            libraryId: response.data[0].library_id,
            accountId: response.data[0].account_id,
            libraryName: response.data[0].library_name
        })
    }

    /**
     *
     * @param {string} accountId
     * @param {string} accessToken
     * @returns {Promise<*>}
     */
    static async findAll({ accountId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            params: {
                select: "*",
                account_id: `eq.${accountId}`,
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data.map((library) => new Library({
            accountId: library.account_id,
            libraryId: library.library_id,
            libraryName: library.library_name,
            sharedAccountIds: library.sharedAccountIds
        }))
    }

    static async findOne({ libraryId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new Library({
            accountId: response.data[0].account_id,
            libraryId: response.data[0].library_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].sharedAccountIds
        })
    }
}
