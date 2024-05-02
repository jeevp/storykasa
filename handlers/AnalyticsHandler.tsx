import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";

export default class AnalyticsHandler {
    static async fetchUserAnalytics(setUsersAnalytics: any) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/admin/analytics/users`, headers)

        setUsersAnalytics(response.data)

        return response.data
    }

    static async fetchDiscoverAnalytics(setDiscoverAnalytics: any) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/admin/analytics/discover`, headers)

        setDiscoverAnalytics(response.data)

        return response.data
    }

    static async fetchStoriesAnalytics(setStoriesAnalytics: any) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/admin/analytics/stories`, headers)

        setStoriesAnalytics(response.data)

        return response.data
    }

    static async fetchCollectionsAnalytics(setCollectionsAnalytics: any) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/admin/analytics/collections`, headers)

        setCollectionsAnalytics(response.data)

        return response.data
    }

    static async fetchSubscriptionsAnalytics(setSubscriptionsAnalytics: any) {
        const headers = generateHeaders()

        const response = await axios.get(`/api/admin/analytics/subscriptions`, headers)

        setSubscriptionsAnalytics(response.data)

        return response.data
    }
}
