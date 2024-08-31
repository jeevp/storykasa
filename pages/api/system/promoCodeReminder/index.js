const { DateTime } = require('luxon')
const PromoCodeTransaction = require("../../../../service/models/PromoCodeTransaction").default
const User = require("../../../../service/models/User")
const EmailService = require("../../../../service/services/EmailService/EmailService").default

export default async function handler(req, res) {
    try {
        // Retrieve the secret token from environment variables
        const secretToken = process.env.CRON_JOB_SECRET
        // Retrieve the token from the request, adjust depending on if you're using a query param or a header
        const requestToken = req.headers['authorization'] || req.query.secret

        // Compare the tokens
        if (requestToken !== secretToken) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        // Fetch all ongoing promo code transactions
        const promoCodeTransactions = await PromoCodeTransaction.findAllOngoingTransactions();

        // Get today's date and calculate the ranges for 7 days and 1-2 days from now
        const today = DateTime.now().startOf('day')
        const sevenDaysFromNowStart = today.plus({ days: 7 })
        const sevenDaysFromNowEnd = today.plus({ days: 8 }).minus({ seconds: 1 })
        const oneDayFromNowStart = today.plus({ days: 1 })
        const twoDaysFromNowStart = today.plus({ days: 2 })

        // Filter transactions with an endDate that is exactly 7 days from today
        const transactionsWithSevenDaysLeft = await Promise.all(
            promoCodeTransactions.filter(transaction => {
                const endDate = DateTime.fromISO(transaction.endDate);
                return endDate >= sevenDaysFromNowStart && endDate <= sevenDaysFromNowEnd
            }).map(async (_transaction) => {
                const user = await User.findOne({ id: _transaction.accountId })
                return {
                    ..._transaction,
                    userEmail: user.email,
                    userName: user.fullName
                };
            })
        );

        // Filter transactions with an endDate that is more than 24 hours but less than 2 days from now
        const transactionsWithOneDayLeft = await Promise.all(
            promoCodeTransactions.filter(transaction => {
                const endDate = DateTime.fromISO(transaction.endDate)
                return endDate >= oneDayFromNowStart && endDate < twoDaysFromNowStart
            }).map(async (_transaction) => {
                const user = await User.findOne({ id: _transaction.accountId })
                return {
                    ..._transaction,
                    userEmail: user.email,
                    userName: user.fullName
                };
            })
        );

        await Promise.all([
            ...transactionsWithOneDayLeft,
            ...transactionsWithSevenDaysLeft
        ].map(async(transaction) => {
            const daysLeft = Math.floor(DateTime.fromISO(transaction.endDate).diffNow('days').days)

            await EmailService.sendPromoCodeEndDateReminderEmail({
                to: transaction.userEmail,
                subject: "Promo Code Period Ending Soon!"
            }, {
                userName: transaction.userName,
                endDate: DateTime.fromISO(transaction.endDate).toLocaleString(),
                daysLeft
            })
        }))

        res.status(200).json({ message: 'Cron job executed successfully' })
    } catch (error) {
        console.error(`Error in CronJob promoCodeReminder: `, error)
        return res.status(400).send({ message: "Something went wrong." })
    }
}
