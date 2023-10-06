import {createContext} from "react";

const ProfileContext = createContext({
    currentProfileId: "",
    setCurrentProfileId: () => ({}),
    currentProfile: null,
    setCurrentProfile: () => ({})
})

export default ProfileContext
