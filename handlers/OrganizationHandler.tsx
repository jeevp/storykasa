import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Organization from "@/models/Organization";

export default class OrganizationHandler {
    static async fetchOrganizations() {
        const headers = generateHeaders()
        const response = await axios.get("/api/admin/organizations", headers)
        return response.data
    }

    static async fetchUserOrganizations() {
        const headers = generateHeaders()
        const response = await axios.get("/api/organizations", headers)

        return response.data.map((organization: Organization) => new Organization({ ...organization }))
    }

    static async createOrganization({ name }: { name: string }) {
        const headers = generateHeaders()
        const payload = { name }

        const response = await axios.post("/api/admin/organizations", payload, headers)

        return new Organization({ ...response.data })
    }

    static async deleteOrganization({ id }: { id: number }) {
        const headers = generateHeaders()
        const response = await axios.delete(`/api/admin/organizations/${id}`, headers)

        return response.data
    }

    static async updateOrganization({ id }: { id: number }, { name, accountOwner }: { name: string, accountOwner: { name: string, email: string } }) {
        const headers = generateHeaders()
        const payload: { name?: string, accountOwner?: { name: string, email: string } } = {}
        if (name) payload.name = name
        if (accountOwner) payload.accountOwner = accountOwner

        const response = await axios.put(`/api/admin/organizations/${id}`, payload, headers)

        return new Organization({ ...response.data })
    }
}
