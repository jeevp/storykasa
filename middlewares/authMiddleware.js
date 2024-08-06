import supabase from "../service/supabase";

const authMiddleware = (handler) => async (req, res,) => {
    // Your existing authentication logic
    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];
    if (!accessToken) {
        return res.status(400).send({ message: "Missing access token" });
    }

    const user = await supabase.auth.getUser(accessToken)
    if (!user) return res.status(401).send({ message: "Invalid access token" })

    req.user = user.data.user
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;

    await handler(req, res);
};

export default authMiddleware;
