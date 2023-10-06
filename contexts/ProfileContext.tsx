import { createContext, Dispatch, SetStateAction } from "react";

interface ProfileContextProps {
    currentProfileId: string | null;
    setCurrentProfileId: Dispatch<SetStateAction<string | null>>;
    currentProfile: Object | null;
    setCurrentProfile: Dispatch<SetStateAction<Object | null>>;
}

const ProfileContext = createContext<ProfileContextProps>({
    currentProfileId: "",
    setCurrentProfileId: () => {},
    currentProfile: null,
    setCurrentProfile: () => {}
});

export default ProfileContext;
