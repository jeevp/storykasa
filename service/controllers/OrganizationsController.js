import APIValidator from "../validators/APIValidator"
import Organization from "../models/Organization";
import User from "../models/User"


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
            const organizations = await Organization.findAll({}, { serializer: true })

            return res.status(200).send(organizations)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }


    static async getUserOrganizations(req, res) {
        const organizations = await Organization.findAll({ accountId: req.user.id })

        return res.status(200).send(organizations)
    }

    static async updateOrganization(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["organizationId"]
            })

            const { organizationId } = req.query
            const { name, accountOwner } = req.body

            const organization = await Organization.findOne({ id: organizationId })

            const attributesToUpdate = {}
            if (name) attributesToUpdate.name = name
            const updatedOrganization = await organization.update({...attributesToUpdate})

            if (accountOwner) {
                let accountOwnerUser = await User.findOne({ email: accountOwner?.email })
                if (!accountOwnerUser) {
                    const { user } = await User.signUp({
                        fullName: `${accountOwner?.name}`,
                        email: accountOwner?.email
                    }, { sendInitialCredentialEmail: true })

                    if (!user) {
                        return res.status(400).send({ message: "Account not created." })
                    }

                    accountOwnerUser = user
                }

                updatedOrganization.accountOwner = accountOwnerUser
                await organization.update({ accountId: accountOwnerUser.id })
            }

            return res.status(202).send(updatedOrganization)
        } catch (error) {
            console.log(error)
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
