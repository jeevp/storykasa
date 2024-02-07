const validateWebsiteAPIKeyMiddleware = (handler) => async (req, res,) => {
    const accessToken = req.headers['access-token']

    if (!accessToken) {
        return res.status(400).send({ message: "Missing access token" })
    }

    if (accessToken !== process.env.WEBSITE_ACCESS_TOKEN) {
        return res.status(401).send({ message: "Not allowed" })
    }

    await handler(req, res);
};

export default validateWebsiteAPIKeyMiddleware;
