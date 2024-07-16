import axios from "axios";
import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";

export default class Organization {
    constructor({
        id,
        name,
        createdAt
    }) {
        this.id = id
        this.name = name
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
            createdAt: organization.created_at
        })
    }

    static async findAll() {
        const response = await axios.get(
            `${process.env.SUPABASE_URL}/rest/v1/organizations`,
            {
                params: {
                    select: "*"
                },
                headers: generateSupabaseHeaders()
            }
        )

        return response.data.map((organization) => new Organization({
            id: organization.id,
            name: organization.name,
            createdAt: organization.created_at,
        }))
    }

    async update({ name }) {
        const payload = {}
        if (name) payload.name = name

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
}
