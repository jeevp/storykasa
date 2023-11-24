// LIBRARIES
const nodemailer = require("nodemailer")

// EMAIL TEMPLATES
const { recoverPasswordEmailTemplate } = require("./templates")

const RECOVER_PASSWORD_EMAIL = "RECOVER_PASSWORD_EMAIL"

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
    static async sendPasswordRecoverEmail({ to, subject }, content = {

    }) {
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

    static sendEmail(emailContext, emailTemplate) {
        return new Promise(async(resolve, reject) => {
            try {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "felipecpfernandes@gmail.com",
                        pass: "Paifer$10"
                    }
                })


                await transporter.sendMail({
                    from: "felipecpfernandes@gmail.com",
                    to: emailContext.to,
                    subject: emailContext.subject,
                    html: emailTemplate
                })

            }
            catch(error) {
                throw error
            }
        })
    }
}

module.exports.default = EmailService
