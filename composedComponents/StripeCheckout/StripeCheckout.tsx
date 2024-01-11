import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "@/composedComponents/StripeCheckout/CheckoutForm/CheckoutForm";
import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import {ArrowBack} from "@mui/icons-material";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";

// @ts-ignore
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const StripeCheckout = ({
    clientSecret,
    subscriptionPlan,
    onCancel = () => ({}),
    onSuccess = () => ({})
}: {
    clientSecret: any,
    subscriptionPlan: any,
    onCancel: () => void,
    onSuccess: () => void
}) => {
    const options = { clientSecret }


    return (
        <div>
            <div className="flex items-center">
                <STKButton iconButton onClick={() => onCancel()}><ArrowBack /></STKButton>
                <div>
                    <h1 className="text-2xl font-bold ml-2">Secure Payment Setup</h1>
                </div>
            </div>
            <div>
                <p className="text-lg max-w-xl">
                    Almost there! To activate your StoryKasa subscription, please enter your credit card details
                    below. We use security measures to ensure your information is safe and
                    protected. Enjoy uninterrupted access to a world of stories with just a few more clicks!
                </p>
            </div>
            <div className="mt-8">
                <STKCard>
                    <div className="p-6">
                        <div>
                            <label className="font-semibold">Subscription plan</label>
                            <div>
                                <label>{subscriptionPlan?.name}</label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold">Monthly price</label>
                            <div>
                                <label>{subscriptionPlan?.price}</label>
                            </div>
                        </div>
                    </div>
                </STKCard>
            </div>
            <div className="mt-4">
                <STKCard>
                    <div className="p-6">
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm
                            // @ts-ignore
                            clientSecret={clientSecret}
                            onSuccess={() => onSuccess()}  />
                        </Elements>
                    </div>
                </STKCard>
            </div>
        </div>

    );
};

export default StripeCheckout;
