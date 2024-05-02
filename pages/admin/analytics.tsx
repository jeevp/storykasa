import PageWrapper from "@/composedComponents/PageWrapper";
import withProfile from "@/HOC/withProfile";
import withAuth from "@/HOC/withAuth";
import React, {useEffect, useState} from "react";
import withAdmin from "@/HOC/withAdmin";
import { AnimatePresence, motion } from "framer-motion";
import STKButton from "@/components/STKButton/STKButton";
import CreatePromoCodeDialog from "@/composedComponents/CreatePromoCodeDialog/CreatePromoCodeDialog";
import {usePromoCode} from "@/contexts/promoCode/PromoCodeContext";
import STKCard from "@/components/STKCard/STKCard";
import PromoCodeHandler from "@/handlers/PromoCodeHandler";
import CopyButton from "@/composedComponents/CopyButton/CopyButton";
import STKChip from "@/components/STKChip/STKChip"
import {useAnalytics} from "@/contexts/analytics/AnalyticsContext";
import AnalyticsHandler from "@/handlers/AnalyticsHandler";
import STKSkeleton from "@/components/STKSkeleton/STKSkeleton";


export const dynamic = "force-dynamic";

function Analytics() {
    // Contexts
    const {
        usersAnalytics,
        setUsersAnalytics,
        discoverAnalytics,
        setDiscoverAnalytics,
        collectionsAnalytics,
        setCollectionsAnalytics,
        storiesAnalytics,
        setStoriesAnalytics,
        subscriptionsAnalytics,
        setSubscriptionsAnalytics
    } = useAnalytics()

    // States
    const [loadingUsersAnalytics, setLoadingUsersAnalytics] = useState(false);
    const [loadingSubscriptionsAnalytics, setLoadingSubscriptionsAnalytics] = useState(false);
    const [loadingStoriesAnalytics, setLoadingStoriesAnalytics] = useState(false);
    const [loadingCollectionsAnalytics, setLoadingCollectionsAnalytics] = useState(false);
    const [loadingDiscoverAnalytics, setLoadingDiscoverAnalytics] = useState(false);

    // Mounted
    useEffect(() => {
        handleFetchUsersAnalytics()
        handleFetchStoriesAnalytics()
        handleFetchDiscoverAnalytics()
        handleFetchSubscriptionsAnalytics()
        handleFetchCollectionsAnalytics()

    }, []);

    // Methods
    const handleFetchUsersAnalytics = async () => {
        setLoadingUsersAnalytics(true)
        await AnalyticsHandler.fetchUserAnalytics(setUsersAnalytics)
        setLoadingUsersAnalytics(false)
    }

    const handleFetchDiscoverAnalytics = async () => {
        setLoadingDiscoverAnalytics(true)
        await AnalyticsHandler.fetchDiscoverAnalytics(setDiscoverAnalytics)
        setLoadingDiscoverAnalytics(false)
    }

    const handleFetchSubscriptionsAnalytics = async () => {
        setLoadingSubscriptionsAnalytics(true)
        await AnalyticsHandler.fetchSubscriptionsAnalytics(setSubscriptionsAnalytics)
        setLoadingSubscriptionsAnalytics(false)
    }

    const handleFetchCollectionsAnalytics = async () => {
        setLoadingCollectionsAnalytics(true)
        await AnalyticsHandler.fetchCollectionsAnalytics(setCollectionsAnalytics)
        setLoadingCollectionsAnalytics(false)
    }

    const handleFetchStoriesAnalytics = async () => {
        setLoadingStoriesAnalytics(true)
        await AnalyticsHandler.fetchStoriesAnalytics(setStoriesAnalytics)
        setLoadingStoriesAnalytics(false)
    }


    return (
        <>
            <PageWrapper admin path="discover">
                <div className="pb-20">
                    <h2 className="m-0">Analytics</h2>
                    <div className="mt-10">
                        <div className="flex sm:w-full pb-32 lg:pb-0">
                            <AnimatePresence mode="wait">
                                (
                                <motion.div
                                    initial={{ x: 10, opacity: 0, width: "100%" }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 10, opacity: 0 }}
                                >
                                    <div>
                                        <div className="mt-10">
                                            <label className="font-semibold">Users</label>
                                            <div className="mt-4">
                                                {loadingUsersAnalytics ? (
                                                    <div>
                                                        <STKSkeleton width="100%" height="55px" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <STKCard>
                                                            <div className="flex p-4 items-center justify-between">
                                                                <label className="font-semibold">Total users</label>
                                                                <label>{usersAnalytics?.totalUsers}</label>
                                                            </div>
                                                        </STKCard>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <label className="font-semibold">Subscriptions</label>
                                            <div className="mt-4">
                                                {loadingSubscriptionsAnalytics ? (
                                                    <div>
                                                        {[1,2,3,4].map((skeleton) => (
                                                            <div className="first:mt-0 mt-2" key={skeleton}>
                                                                <STKSkeleton width="100%" height="55px" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Free</label>
                                                                    <label>{subscriptionsAnalytics?.totalFreeSubscriptions}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Premium</label>
                                                                    <label>{subscriptionsAnalytics?.totalPremiumSubscriptions}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Premium Plus</label>
                                                                    <label>{subscriptionsAnalytics?.totalPremiumPlusSubscriptions}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Organizational</label>
                                                                    <label>{subscriptionsAnalytics?.totalOrganizationalSubscriptions}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <label className="font-semibold">Stories</label>
                                            <div className="mt-4">
                                                {loadingStoriesAnalytics ? (
                                                    <div>
                                                        {[1,2,3,4].map((skeleton) => (
                                                            <div className="first:mt-0 mt-2" key={skeleton}>
                                                                <STKSkeleton width="100%" height="55px" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total stories</label>
                                                                    <label>{storiesAnalytics?.totalStories}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total minutes listened</label>
                                                                    <label>{storiesAnalytics?.totalMinutesListened}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total minutes recorded</label>
                                                                    <label>{storiesAnalytics?.totalMinutesRecorded}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total languages</label>
                                                                    <label>{storiesAnalytics?.totalLanguages}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <label className="font-semibold">Collections</label>
                                            <div className="mt-4">
                                                {loadingCollectionsAnalytics ? (
                                                    <div>
                                                        {[1,2,3,4].map((skeleton) => (
                                                            <div className="first:mt-0 mt-2" key={skeleton}>
                                                                <STKSkeleton width="100%" height="55px" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total collections</label>
                                                                    <label>{collectionsAnalytics?.totalCollections}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total private collections</label>
                                                                    <label>{collectionsAnalytics?.totalPrivateCollections}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total shared collections</label>
                                                                    <label>{collectionsAnalytics?.totalSharedCollections}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total listeners</label>
                                                                    <label>{collectionsAnalytics?.totalListeners}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total stories added to collections</label>
                                                                    <label>{collectionsAnalytics?.totalStoriesAddedToCollections}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <label className="font-semibold">Discover</label>
                                            <div className="mt-4">
                                                {loadingDiscoverAnalytics ? (
                                                    <div>
                                                        {[1,2,3,4].map((skeleton) => (
                                                            <div className="first:mt-0 mt-2" key={skeleton}>
                                                                <STKSkeleton width="100%" height="55px" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div>
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total public stories</label>
                                                                    <label>{discoverAnalytics?.totalPublicStories}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                        <div className="mt-2">
                                                            <STKCard>
                                                                <div className="flex p-4 items-center justify-between">
                                                                    <label className="font-semibold">Total stories submitted to public for sharing</label>
                                                                    <label>{discoverAnalytics?.totalStoriesSubmittedToPublicForSharing}</label>
                                                                </div>
                                                            </STKCard>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </>
    );
}

export default withAuth(withProfile(withAdmin(Analytics)));
