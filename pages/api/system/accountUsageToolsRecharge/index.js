const Account = require("../../../../service/models/Account")
export default async function handler(req, res) {
    // Retrieve the secret token from environment variables
    const secretToken = process.env.CRON_JOB_SECRET;
    // Retrieve the token from the request, adjust depending on if you're using a query param or a header
    const requestToken = req.headers['authorization'] || req.query.secret;

    // Compare the tokens
    if (requestToken !== secretToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    await Account.rechargeAccountsToolsUsage()

    res.status(200).json({ message: 'Cron job executed successfully' });
}
