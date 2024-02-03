import React, {useState} from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import STKButton from "@/components/STKButton/STKButton";
import SubscriptionPlanHandler from "@/handlers/SubscriptionPlanHandler";
import useDevice from "@/customHooks/useDevice";

interface  CheckoutFormProps {
    onSuccess: () => void
}


const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const { onMobile } = useDevice()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
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
                setError(`
                    We're sorry, but we couldn't process your subscription payment. This could be due to a variety of 
                    reasons such as insufficient funds, card expiration, or a temporary hold by your bank. To 
                    ensure uninterrupted service, please update your payment details. If you continue to see this message, please contact our 
                    support team for assistance. We're here to help!
                `)
            } else {
                if (result.setupIntent && result.setupIntent.status === 'succeeded') {
                    await SubscriptionPlanHandler.attachPaymentMethodToCustomer({
                        // @ts-ignore
                        paymentMethodId: result?.setupIntent.payment_method
                    })

                    onSuccess()
                }
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <div className="mt-8 flex justify-end">
                <STKButton fullWidth={onMobile} type="submit" loading={loading}>Confirm payment</STKButton>
            </div>
            {error && (
                <div className="px-4 py-4 bg-red-50 rounded-2xl mt-8">
                    <label className="mt-4 text-red-800 text-md">{error}</label>
                </div>
            )}
        </form>
    );
};

export default CheckoutForm;
