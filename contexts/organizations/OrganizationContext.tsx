import {createContextProvider} from "@/contexts/createContextProvider"
import useOrganizationState from "./useOrganizationState"

export const [OrganizationProvider, useOrganization] = createContextProvider(useOrganizationState)
