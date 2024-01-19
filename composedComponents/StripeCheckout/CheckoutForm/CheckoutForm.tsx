import React, {useState} from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import STKButton from "@/components/STKButton/STKButton";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";

interface  CheckoutFormProps {
    onSuccess: () => void
}


const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not yet loaded.
        }
        setLoading(true)
        const result = await stripe.confirmSetup({
            elements,
            redirect: 'if_required',
            confirmParams: {},
        });
        
        if (result.error) {
            console.log(result.error.message);
            // Handle error here, such as displaying a message to the user
        } else {
            if (result.setupIntent && result.setupIntent.status === 'succeeded') {
                await SubscriptionPlanHandler.attachPaymentMethodToCustomer({
                    // @ts-ignore
                    paymentMethodId: result?.setupIntent.payment_method
                })

                onSuccess()
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <div className="mt-8 flex justify-end">
                <STKButton type="submit" loading={loading}>Confirm payment</STKButton>
            </div>
        </form>
    );
};

export default CheckoutForm;
