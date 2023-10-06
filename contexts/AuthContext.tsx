import { createContext, Dispatch, SetStateAction } from "react";

interface AuthContextProps {
    currentUser: Object | null;
    setCurrentUser: Dispatch<SetStateAction<Object | null>>;
}

// Assuming User is an interface you've defined elsewhere
// If you haven't defined User, replace User with any or the actual shape of your user object

const AuthContext = createContext<AuthContextProps>({
    currentUser: null,
    setCurrentUser: () => {}
});

export default AuthContext;
