import {createContext} from "react";

const AuthContext = createContext({
    currentUser: null,
    setCurrentUser: () => ({})
})

export default AuthContext
