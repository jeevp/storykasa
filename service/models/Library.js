import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import axios from "axios";
import Account from "../models/Account"

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
     * @param {string} sharedAccountId
     * @param {string} accessToken
     * @param {boolean} serialized
     * @returns {Promise<*>}
     */
    static async findAll({ accountId, sharedAccountId }, { accessToken }, { serialized = false }) {
        const queryParams = { select: "*" }
        if (accountId) queryParams.account_id = `eq.${accountId}`
        if (sharedAccountId) {
            queryParams.shared_account_ids = `cs.{${sharedAccountId}}`;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            params: queryParams,
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data.map(async (library) => {
            const _library = new Library({
                accountId: library.account_id,
                libraryId: library.library_id,
                libraryName: library.library_name,
                sharedAccountIds: library.shared_account_ids
            })

            if (serialized) {
                const librarySerialized = await _library.serializer({ accessToken })
                return librarySerialized
            }

            return _library
        })
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
            sharedAccountIds: response.data[0].shared_account_ids
        })
    }

    async update({ sharedAccountIds }, { accessToken }) {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            shared_account_ids: sharedAccountIds
        }, {
            params: {
                select: "*",
                library_id: `eq.${this.libraryId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new Library({
            accountId: response.data[0].account_id,
            libraryId: response.data[0].library_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].shared_account_ids
        })
    }

    async serializer({ accessToken }) {
        const listeners = []
        await Promise.all(this.sharedAccountIds.map(async(sharedAccountId) => {
            const account = await Account.findOne({ accountId: sharedAccountId }, { accessToken })
            listeners.push({
                avatarUrl: account.avatarUrl,
                name: account.name,
                accountId: account.accountId
            })
        }))

        return {
            accountId: this.accountId,
            libraryId: this.libraryId,
            libraryName: this.libraryName,
            sharedAccountIds: this.sharedAccountIds,
            listeners
        }
    }
}
