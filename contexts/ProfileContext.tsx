import {createContext} from "react";

const ProfileContext = createContext({
    currentProfileId: "",
    setCurrentProfileId: () => ({})
})

export default ProfileContext
