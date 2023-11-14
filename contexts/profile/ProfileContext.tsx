import {createContextProvider} from "@/contexts/createContextProvider";
import useProfileState from "@/contexts/profile/useProfileState";

export const [ProfileProvider, useProfile] = createContextProvider(useProfileState)
