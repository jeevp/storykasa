const authMiddleware = (handler) => async (req, res,) => {
    // Your existing authentication logic
    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];
    if (!accessToken) {
        return res.status(400).send({ message: "Missing access token" });
    }
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;

    await handler(req, res);
};

export default authMiddleware;
