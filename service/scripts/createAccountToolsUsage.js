async function createAccountToolsUsage() {
    require('dotenv').config({ path: '.env' });

    console.log(">>> Start script - create Account tools usage for existing accountToolsUsage")
    const Account = require("../models/Account")
    const User = require("../models/User")
    const AccountToolsUsage = require("../models/AccountToolsUsage")

    const accounts = await Account.findAll()
    const accountsToolsUsage = await AccountToolsUsage.findAll()

    const accountsWithoutAccountToolsUsageConfiguration = []

    await Promise.all((accounts.map(async(account) => {
        const accountToolsUsage = await accountsToolsUsage.find((accountToolsUsage) => accountToolsUsage.accountId === account.accountId)

        if (!accountToolsUsage) {
            accountsWithoutAccountToolsUsageConfiguration.push(account.accountId)
        }
    })))

    console.log(`>>> Creating ${accountsWithoutAccountToolsUsageConfiguration.length} accounts usage tools`)

    for (let account = 0; account < accountsWithoutAccountToolsUsageConfiguration.length; account += 1) {
        const accountId = accountsWithoutAccountToolsUsageConfiguration[account]
        await AccountToolsUsage.create({ accountId: accountId })
    }

    console.log(">>> End script - create Account tools usage for existing accountToolsUsage")
}

createAccountToolsUsage()
