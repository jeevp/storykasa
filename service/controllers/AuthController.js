const supabase = require("../supabase")
const Profile = require("../models/Profile");
const APIValidator = require("../validators/APIValidator")
const TernsAndPrivacyConsent = require("../models/TermsAndPrivacyConsent")
const StripeService = require("../services/StripeService/StripeService")
const StripeAccount = require("../models/StripeAccount")
const Subscription = require("../models/Subscription")
const AccountToolsUsage = require("../models/AccountToolsUsage")
const MailchimpService = require("../services/MailchimpService/MailchimpService").default
const MailchimpUser = require("../models/MailchimpUser")

class AuthController {
    static async signUp(req, res) {
        try {
            const {
                email,
                password,
                fullName,
                termsAgreed,
                browserName,
                browserVersion,
            } = req.body

            if (!email || !password || !fullName || !termsAgreed || !browserName || !browserVersion) {
                return res.status(400).send({
                    message: "Payload is incorrect."
                })
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    },
                },
            })

            if (error) {
                return APIValidator.generateErrorMessage({ serverErrorMessage: error?.message }, res)
            }

            // Save terms of service
            const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            await TernsAndPrivacyConsent.create({
                userId: data.user.id,
                userIP,
                browserVersion,
                browserName,
                termsAgreed
            })

            await supabase.auth.setSession({
                refresh_token: data.session.refresh_token,
                access_token: data.session.access_token
            })

            // Create default profile
            const profile = await Profile.createProfile({
                name: fullName
            }, { accessToken: req.accessToken })


            // Let's create a free account as default
            const stripeCustomer = await StripeService.customers.create({ email })

            const subscription = await StripeService.subscriptions.create({
                customerId: stripeCustomer?.id,
                planId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID
            })

            const stripeAccount = await StripeAccount.create({
                accountId: data.user.id,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomer.id
            })

            const { FREE_SUBSCRIPTION_PLAN } = Subscription.getAllowedSubscriptionPlanNames()
            await Subscription.create({
                accountId: data.user.id,
                stripeAccountId: stripeAccount.id,
                subscriptionPlan: FREE_SUBSCRIPTION_PLAN,
            })

            // Let's create the account tools usage configuration
            await AccountToolsUsage.create({ accountId: data.user.id })

            // Add user to mailchimp contact list
            const mailchimpMember = await MailchimpService.addMemberToList({
                email,
                firstName: fullName
            })

            if (mailchimpMember) {
                await MailchimpUser.create({ userId: data.user.id, mailchimpMemberId: mailchimpMember?.id })
            }

            return res.status(200).send({
                ...data,
                profile
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async signInWithPassword(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).send({
                    message: "Payload is incorrect."
                })
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                return APIValidator.generateErrorMessage({ serverErrorMessage: error?.message }, res)
            }

            const defaultProfile = await Profile.getDefaultAccountProfile({
                accessToken: data.session.access_token
            })

            await supabase.auth.setSession({
                refresh_token: data.session.refresh_token,
                access_token: data.session.access_token
            })

            return res.status(200).send({
                ...data,
                defaultProfile
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async signOut(req, res) {
        try {
            await supabase.auth.signOut()

            return res.status(201).send({ message: "Session has been finished with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async requestPasswordRecovery(req, res) {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(400).send({ message: "Payload is incorrect." })
            }

            let rootURL;
            if (req.headers.referer) {
                rootURL = new URL(req.headers.referer).origin;
            } else if (req.headers.origin) {
                // If the Referer header is not present, try the Origin header
                rootURL = req.headers.origin;
            } else {
                // If neither header is present, fall back to the environment variable
                rootURL = process.env.NEXT_PUBLIC_ORIGIN;
            }

            const redirectToURL = `${rootURL}/update-password`

            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectToURL
            })

            return res.status(201).send({ message: "Password recovery requested with success" })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }

    static async updatePassword(req, res) {
        try {
            const { password } = req.body

            if (!password) {
                return res.status(400).send({ message: "Payload is incorrect." })
            }

            await supabase.auth.setSession({
                refresh_token: req.refreshToken,
                access_token: req.accessToken
            })

            await supabase.auth.updateUser({ password })

            return res.status(200).send({ message: "Password updated with success" })
        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}


module.exports = AuthController
