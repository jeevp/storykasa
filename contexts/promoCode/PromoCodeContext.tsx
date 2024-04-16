import {createContextProvider} from "@/contexts/createContextProvider"
import usePromoCodeState from "./usePromoCodeState"

export const [PromoCodeProvider, usePromoCode] = createContextProvider(usePromoCodeState)
