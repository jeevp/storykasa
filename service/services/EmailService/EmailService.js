// LIBRARIES
const nodemailer = require("nodemailer")

// EMAIL TEMPLATES
const {
    recoverPasswordEmailTemplate,
    listenerInvitationEmailTemplate,
    initialCredentialEmailTemplate,
    promoCodeEndDateReminderEmailTemplate
} = require("./templates")

const RECOVER_PASSWORD_EMAIL = "RECOVER_PASSWORD_EMAIL"
const LISTENER_INVITATION_EMAIL = "LISTENER_INVITATION_EMAIL"
const INITIAL_CREDENTIAL_EMAIL_TYPE = "INITIAL_CREDENTIAL_EMAIL_TYPE"
const PROMO_CODE_END_DATE_REMINDER_EMAIL_TYPE = "PROMO_CODE_END_DATE_REMINDER_EMAIL_TYPE"

class EmailTemplate {
    constructor({ emailType }) {
        this.emailType = emailType
    }

    async getHtml(params) {
        try {
            let htmlTemplate = null

            switch (this.emailType) {
                case RECOVER_PASSWORD_EMAIL:
                    htmlTemplate = recoverPasswordEmailTemplate(params)
                    return htmlTemplate

                case LISTENER_INVITATION_EMAIL:
                    htmlTemplate = listenerInvitationEmailTemplate(params)
                    return htmlTemplate

                case INITIAL_CREDENTIAL_EMAIL_TYPE:
                    htmlTemplate = initialCredentialEmailTemplate(params)
                    return htmlTemplate

                case PROMO_CODE_END_DATE_REMINDER_EMAIL_TYPE:
                    htmlTemplate = promoCodeEndDateReminderEmailTemplate(params)
                    return htmlTemplate

                default:
                    break
            }
        }
        catch(error) {
            throw error
        }
    }
}

class EmailContext {
    constructor({ from, to, subject }) {
        this.from = from
        this.to = to
        this.subject = subject
    }
}

class EmailService {
    static async sendPasswordRecoverEmail({ to, subject }, content = {}) {
        try {
            const emailContext = new EmailContext({ to, subject })

            const emailTemplate = await new EmailTemplate({ emailType: RECOVER_PASSWORD_EMAIL }).getHtml({

            })

            await this.sendEmail(emailContext, emailTemplate)
        }
        catch(error) {
            throw error
        }
    }

    static async sendListenerInvitationEmail({ to, subject }, { collectionTitle, collectionOwnerName }) {
        const emailContext = new EmailContext({ to, subject })

        const emailTemplate = await new EmailTemplate({
            emailType: LISTENER_INVITATION_EMAIL
        }).getHtml({
            collectionTitle,
            collectionOwnerName
        })

        await this.sendEmail(emailContext, emailTemplate)
    }

    static async sendInitialCredentialEmail({ to, subject }, { userEmail, temporaryPassword }) {
        const emailContext = new EmailContext({ to, subject })

        const emailTemplate = await new EmailTemplate({
            emailType: INITIAL_CREDENTIAL_EMAIL_TYPE
        }).getHtml({
            userEmail,
            temporaryPassword
        })

        await this.sendEmail(emailContext, emailTemplate)
    }

    static async sendPromoCodeEndDateReminderEmail({ to, subject }, { userName, daysLeft, endDate }) {
        const emailContext = new EmailContext({ to, subject })

        const emailTemplate = await new EmailTemplate({
            emailType: PROMO_CODE_END_DATE_REMINDER_EMAIL_TYPE
        }).getHtml({
            userName,
            daysLeft,
            endDate
        })

        await this.sendEmail(emailContext, emailTemplate)
    }

    static async sendEmail(emailContext, emailTemplate) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_PASSWORD
            }
        })


        await transporter.sendMail({
            from: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
            to: emailContext.to,
            subject: emailContext.subject,
            html: emailTemplate
        })

    }
}

module.exports.default = EmailService
