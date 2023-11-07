import ProfileServiceHandler from "../handlers/ProfileServiceHandler"
import {MAX_PROFILES_ALLOWED} from "../../models/Profile";
class ProfileValidator {
    static async validateMaxProfiles(req, res) {
        const profiles = await ProfileServiceHandler.getAccountProfiles({ accessToken: req.accessToken })

        if (profiles.length >= MAX_PROFILES_ALLOWED) {
            return res.status(400).send("This account has reached the max amount of profiles allowed")
        }

        return true
    }
}


module.exports = ProfileValidator
