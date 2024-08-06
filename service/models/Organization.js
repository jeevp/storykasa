import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import User from "../models/User"

export default class Organization {
    constructor({
        id,
        name,
        accountId,
        accountOwner,
        createdAt
    }) {
        this.id = id
        this.name = name
        this.accountId = accountId
        this.accountOwner = accountOwner
        this.createdAt = createdAt
    }

    static async create({
        name
    }) {
        const payload = {}
        if (name) payload.name = name

        if (Object.keys(payload).length === 0) return

        const response = await axios.post(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            {
                name
            },
            {
                headers: generateSupabaseHeaders()
            }
        )

        const organization = response.data[0]

        return new Organization({
            id: organization.id,
            name: organization.name,
            createdAt: organization.created_at
        })
    }

    static async findOne({ id }) {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            {
                params: {
                    select: "*",
                    id: `eq.${id}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        if (!response.data[0]) return null

        const organization = response.data[0]

        return new Organization({
            id: organization.id,
            name: organization.name,
            createdAt: organization.created_at,
            accountId: organization.account_id
        })
    }

    static async findAll(params = { accountId: null }, options = { serializer: false }) {
        const _params = { select: "*" }
        if (params.accountId) _params.account_id = `eq.${params.accountId}`

        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            {
                params: _params,
                headers: generateSupabaseHeaders()
            }
        )

        if (!options.serializer) {
            return response.data.map((organization) => new Organization({
                id: organization.id,
                name: organization.name,
                accountId: organization.account_id,
                createdAt: organization.created_at,
            }))
        }

        const organizationsSerialized = []
        await Promise.all(response.data.map(async(organization) => {
            const accountOwnerUser = await User.findOne({ id: organization.account_id })

            organizationsSerialized.push(new Organization({
                id: organization.id,
                name: organization.name,
                accountId: organization.account_id,
                accountOwner: accountOwnerUser,
                createdAt: organization.created_at
            }))
        }))

        return organizationsSerialized
    }

    async update({ name, accountId }) {
        const payload = {}
        if (name) payload.name = name
        if (accountId) payload.account_id = accountId

        if (Object.keys(payload).length === 0) return

        const response = await axios.patch(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            payload,
            {
                params: {
                    select: "*",
                    id: `eq.${this.id}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        if (!response.data[0]) return null

        const organization = response.data[0]

        return new Organization({
            id: organization.id,
            name: organization.name,
            accountId: organization.account_id,
            createdAt: organization.created_at
        })
    }

    async destroy() {
        await axios.delete(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            {
                params: {
                    select: "*",
                    id: `eq.${this.id}`
                },
                headers: generateSupabaseHeaders()
            }
        )

        return new Organization({
            id: this.id,
            name: this.name,
        })
    }

    async serializer() {
        const accountOwnerUser = await User.findOne({ id: this.accountId })

        return {
            id: this.id,
            name: this.name,
            accountId: this.accountId,
            accountOwner: accountOwnerUser
        }
    }
}
