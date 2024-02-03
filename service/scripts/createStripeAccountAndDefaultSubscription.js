async function createStripeAccountAndDefaultSubscription() {
    require('dotenv').config({ path: '.env' });
    const convertArrayToHash = require("../../utils/convertArrayToHash")

    console.log(">>> Start script - create stripe accounts and subscription")
    const Account = require("../models/Account")
    const StripeAccount = require("../models/StripeAccount")
    const User = require("../models/User")
    const StripeService = require("../services/StripeService/StripeService")
    const Subscription = require("../models/Subscription")

    const accounts = await Account.findAll()

    const stripeAccounts = await StripeAccount.findAll()

    const accountsWithoutStripeAccountsAndSubscriptions = []

    await Promise.all((accounts.map(async(account) => {
        const stripeAccount = await stripeAccounts.find((_stripeAccount) => _stripeAccount.accountId === account.accountId)

        if (!stripeAccount) {
            accountsWithoutStripeAccountsAndSubscriptions.push(account.accountId)
        }
    })))

    const users = await User.findAll()
    const usersHash = convertArrayToHash(users, "id")
    console.log(`>>> Creating ${accountsWithoutStripeAccountsAndSubscriptions.length} stripe accounts and subscriptions`)

    for (let account = 0; account < accountsWithoutStripeAccountsAndSubscriptions.length; account += 1) {
        const accountId = accountsWithoutStripeAccountsAndSubscriptions[account]
        const user = usersHash[accountId]

        if (user) {
            const stripeCustomer = await StripeService.customers.create({ email: user.email })

            const subscription = await StripeService.subscriptions.create({
                customerId: stripeCustomer?.id,
                planId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID
            })

            const stripeAccount = await StripeAccount.create({
                accountId: accountId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: stripeCustomer.id
            })

            await Subscription.create({
                accountId: accountId,
                stripeAccountId: stripeAccount.id,
                subscriptionPlan: Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN
            })
        }
    }

    console.log(">>> End script - create stripe accounts and subscription")
}

createStripeAccountAndDefaultSubscription()
