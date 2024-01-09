import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import STKButton from "@/components/STKButton/STKButton";

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
    const stripe = useStripe();
    const elements = useElements();

    // Methods
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                // Additional confirmation parameters can be specified here if needed
            },
        });

        if (result.error) {
            // Show error to your customer
            console.log(result.error.message);
        } else {
            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                console.log(">>>> PAYMENT SUCCEEDED >>>>")
                // Handle post-payment actions here
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="w-full">
            <PaymentElement />
            <div className="mt-8 flex justify-end">
                <STKButton type="submit">Submit</STKButton>
            </div>
        </form>
    );
};

export default CheckoutForm;
