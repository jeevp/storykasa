import APIValidator from "../validators/APIValidator"
import Organization from "../models/Organization";

export default class PromoCodesController {
    static async createOrganization(req, res) {
        try {
            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["name"]
            })

            const { name } = req.body

            const organization = await Organization.create({ name })

            return res.status(201).send(organization)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getOrganizations(req, res) {
        try {
            const organizations = await Organization.findAll()

            return res.status(200).send(organizations)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async updateOrganization(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["organizationId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["name"]
            })

            const { organizationId } = req.query
            const { name } = req.body

            const organization = await Organization.findOne({ id: organizationId })

            const updatedOrganization = await organization.update({ name })

            return res.status(202).send(updatedOrganization)
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async deleteOrganization(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["organizationId"]
            })

            const { organizationId } = req.query

            const organization = await Organization.findOne({ id: organizationId })

            if (!organization){
                return res.status(404).send({ message: "Organization not found." })
            }

            await organization.destroy()

            return res.status(204).send()
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}
