import supabase from "../service/supabase";
import {allowedAdminUsers} from "../service/config";

const authMiddleware = (handler) => async (req, res,) => {
    // Your existing authentication logic
    const accessToken = req.headers['access-token'];
    const refreshToken = req.headers['refresh-token'];
    if (!accessToken) {
        return res.status(400).send({ message: "Missing access token" });
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken)

    if (!allowedAdminUsers.includes(user.email)) {
        return res.status(401).send({ message: "Not allowed" })
    }

    req.accessToken = accessToken;
    req.refreshToken = refreshToken;

    await handler(req, res);
};

export default authMiddleware;
