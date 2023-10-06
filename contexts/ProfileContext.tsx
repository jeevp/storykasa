import {createContext} from "react";

const ProfileContext = createContext({
    currentProfileId: "",
    setCurrentProfileId: () => ({}),
    currentProfile: {},
    setCurrentProfile: () => ({})
})

export default ProfileContext
