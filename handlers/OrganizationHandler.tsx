import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Organization from "@/service/models/Organization";

export default class OrganizationHandler {
    static async fetchOrganizations() {
        const headers = generateHeaders()
        const response = await axios.get("/api/admin/organizations", headers)
        return response.data
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

    static async updateOrganization({ id }: { id: number }, { name }: { name: string }) {
        const headers = generateHeaders()
        const payload: { name?: string } = {}
        if (name) payload.name = name

        const response = await axios.put(`/api/admin/organizations/${id}`, payload, headers)

        return new Organization({ ...response.data })
    }
}
