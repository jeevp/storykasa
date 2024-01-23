
import {useState} from 'react'
import PageWrapper from '@/composedComponents/PageWrapper'
import withAuth from "@/HOC/withAuth";
import withProfile from "@/HOC/withProfile";
import STKTabs from "@/components/STKTabs/STKTabs";
import UpdateSubscriptionDialog from "@/composedComponents/UpdateSubscriptionDialog/UpdateSubscriptionDialog";
import STKButton from "@/components/STKButton/STKButton";
import {useSubscription} from "@/contexts/subscription/SubscriptionContext";
import useDevice from "@/customHooks/useDevice";

function AccountSettings() {
    // States
    const [showUpdateSubscriptionDialog, setShowUpdateSubscriptionDialog] = useState(false)

    // Contexts
    const { currentSubscription } = useSubscription()

    const { onMobile } = useDevice()

    return (
        <PageWrapper path="library">
            <div>
                <div className="flex items-center">
                    <h2 className="m-0 text-2xl">
                        Account Settings
                    </h2>
                </div>
                <div className="mt-4 flex flex-col lg:flex-row justify-between w-full items-center">
                    <p className="max-w-xl">
                        Collections are groups of stories. Organize stories in your own collections, or create
                        shared collections by inviting friends and family.
                    </p>
                </div>
                <div className="mt-8">
                    <STKTabs
                    tabs={[{ label: "Subscription", value: "subscription" }]}
                    value={0}
                    />

                    <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex lg:items-center flex-col lg:flex-row">
                            <div>
                                <label className="font-semibold">Subscription plan</label>
                                <div className="mt-2">
                                    <label>{currentSubscription?.subscriptionPlanName}</label>
                                </div>
                            </div>
                            <div className="lg:ml-8 mt-4 lg:mt-0">
                                <label className="font-semibold">Monthly price</label>
                                <div className="mt-2">
                                    <label>${currentSubscription?.monthlyPrice}</label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 lg:mt-0">
                            <STKButton fullWidth={onMobile} onClick={() => setShowUpdateSubscriptionDialog(true)}>Update subscription</STKButton>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateSubscriptionDialog
            active={showUpdateSubscriptionDialog}
            onClose={() => setShowUpdateSubscriptionDialog(false)} />
        </PageWrapper>
    )
}

export default withAuth(withProfile((AccountSettings)))
