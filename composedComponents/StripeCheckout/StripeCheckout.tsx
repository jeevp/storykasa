import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "@/composedComponents/StripeCheckout/CheckoutForm/CheckoutForm";
import STKCard from "@/components/STKCard/STKCard";
import STKButton from "@/components/STKButton/STKButton";
import {ArrowBack} from "@mui/icons-material";

// @ts-ignore
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const StripeCheckout = ({
    clientSecret,
    subscriptionPlan,
    onCancel = () => ({})
}: {
    clientSecret: any,
    subscriptionPlan: any,
    onCancel: () => void
}) => {
    const options = { clientSecret }

    return (
        <div>
            <div className="flex items-center">
                <STKButton iconButton onClick={() => onCancel()}><ArrowBack /></STKButton>
                <h1 className="text-2xl font-bold text-center ml-2">Payment</h1>
            </div>
            <div>
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
                            <CheckoutForm clientSecret={clientSecret}  />
                        </Elements>
                    </div>
                </STKCard>
            </div>
        </div>

    );
};

export default StripeCheckout;
