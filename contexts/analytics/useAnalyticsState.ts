import { useState } from 'react';

export default function useAnalyticsState() {
    const [usersAnalytics, setUsersAnalytics] = useState<any>({})
    const [discoverAnalytics, setDiscoverAnalytics] = useState<any>({})
    const [storiesAnalytics, setStoriesAnalytics] = useState<any>({})
    const [collectionsAnalytics, setCollectionsAnalytics] = useState<any>({})
    const [subscriptionsAnalytics, setSubscriptionsAnalytics] = useState<any>({})

    return {
        usersAnalytics,
        setUsersAnalytics,
        discoverAnalytics,
        setDiscoverAnalytics,
        storiesAnalytics,
        setStoriesAnalytics,
        collectionsAnalytics,
        setCollectionsAnalytics,
        subscriptionsAnalytics,
        setSubscriptionsAnalytics
    };
}
