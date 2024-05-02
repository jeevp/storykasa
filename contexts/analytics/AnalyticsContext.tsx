import {createContextProvider} from "@/contexts/createContextProvider"
import useAnalyticsState from "./useAnalyticsState"

export const [AnalyticsProvider, useAnalytics] = createContextProvider(useAnalyticsState)
