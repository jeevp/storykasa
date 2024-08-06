const authMiddleware = (req, res, next) => {
    console.log({ headers: req.headers })
    const accessToken = req.headers['access-token']
    const refreshToken = req.headers['refresh-token']

    if (!accessToken) {
        return res.status(400).send({ message: "Missing access token" })
    }

    req.accessToken = accessToken
    req.refreshToken = refreshToken
    next()
}

module.exports = {
    authMiddleware
}
