import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "@/composedComponents/StripeCheckout/CheckoutForm/CheckoutForm";
import STKCard from "@/components/STKCard/STKCard";
import STKTextField from "@/components/STKTextField/STKTextField"
import STKButton from "@/components/STKButton/STKButton";
import {useEffect, useState} from "react";
import PromoCodeHandler from "@/handlers/PromoCodeHandler";

// @ts-ignore
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const StripeCheckout = ({
    clientSecret,
    subscriptionPlan,
    onCancel = () => ({}),
    onSuccess = () => ({}),
    onPromoCode = () => ({})
}: {
    clientSecret: any,
    subscriptionPlan: any,
    onCancel: () => void,
    onSuccess: () => void
    onPromoCode: (promoCode: string) => void
}) => {
    const [loadingPromoCodeValidation, setLoadingPromoCodeValidation] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [promoCodeDetails, setPromoCodeDetails] = useState({})
    const [promoCodeIsValid, setPromoCodeIsValid] = useState(undefined)
    const [chargeHelperText, setChargeHelperText] = useState("")
    const options = { clientSecret }

    // Watchers
    useEffect(() => {
        if (subscriptionPlan) {
            setChargeHelperText(`This is a recurring charge. ${subscriptionPlan?.price} will be automatically
                                billed to your credit card every month. `)
        }
    }, [subscriptionPlan]);

    const handleOnChange = (value: string) => {
        setPromoCodeIsValid(undefined)
        setPromoCode(value)
    }

    const handleApplyPromoCode = async () => {
        setLoadingPromoCodeValidation(true)
        const _promoCode = await PromoCodeHandler.validatePromoCode(promoCode)
        // @ts-ignore
        setPromoCodeIsValid(_promoCode?.isValid)
        setPromoCodeDetails(_promoCode)

        // @ts-ignore
        if (_promoCode?.isValid) onPromoCode(_promoCode)

        generateChargeHelperText(_promoCode?.code)
        setLoadingPromoCodeValidation(false)
    }

    const generateChargeHelperText = (promoCode: any) => {
        let price = subscriptionPlan?.price
        let text = `This is a recurring charge. ${price} will be automatically billed to your credit card every month.`

        if (promoCode) {
            price = subscriptionPlan?.priceNumber - (subscriptionPlan?.priceNumber * (promoCode?.discountPercentage / 100))
        }
        if (promoCode && promoCode.duration === "repeating") {
            if (promoCode.discountPercentage === 100) {
                text = `No charges will be billed to your credit card on the following ${promoCode.durationInMonths} months. Afterwards, your credit card will be billed ${subscriptionPlan?.price} every month.`
            } else {
                text = `This is a recurring charge. ${price} will be automatically billed to your credit card on the following ${promoCode.durationInMonths} months. Afterwards, your credit card will be billed ${subscriptionPlan?.price} every month.`
            }
        }

        if (promoCode && promoCode.duration === "forever") {
            text = `This is a recurring charge. ${price} will be automatically billed to your credit card every month.`
        }

        if (promoCode && promoCode?.duration === "once") {
            text = `This is a recurring charge. ${price} will be billed to your credit card on the first month. Afterwards, you will be billed ${subscriptionPlan?.price} on every month.`
        }

        setChargeHelperText(text)
    }

    console.log({ subscriptionPlan })
    return (
        <div>
            <div>
                <p className="text-lg max-w-xl">
                    Almost there! To activate your StoryKasa subscription, please enter your credit card details
                    below. We use security measures to ensure your information is safe and
                    protected. Enjoy uninterrupted access to a world of stories with just a few more clicks!
                </p>
            </div>
            <div className="mt-8">
                <div>
                    <label className="font-semibold">Promo Code</label>
                    <div className="mt-2 flex items-center">
                        <STKTextField
                        value={promoCode}
                        onChange={handleOnChange}
                        error={promoCodeIsValid === false}
                        helperText={promoCodeIsValid === false ? "Promo code is not valid." : promoCodeIsValid ? "Promo code applied with success." : ""} />
                        <div className="ml-4">
                            <STKButton
                            onClick={handleApplyPromoCode}
                            loading={loadingPromoCodeValidation}>Apply</STKButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <STKCard>
                    <div className="p-6">
                        <div>
                            <label className="font-semibold">Subscription plan</label>
                            <div>
                                <label>{subscriptionPlan?.name} {subscriptionPlan?.extensionName}</label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold">Monthly price</label>
                            <div className="flex items-center">
                                <label
                                    // @ts-ignore
                                    className={promoCodeDetails?.isValid ? "line-through" : ""}>{subscriptionPlan?.price}</label>
                                {
                                // @ts-ignore
                                promoCodeDetails?.isValid && (
                                    <div className="ml-2">
                                        <label>{
                                        // @ts-ignore
                                        subscriptionPlan?.priceNumber - (subscriptionPlan?.priceNumber * (promoCodeDetails?.discountPercentage / 100))}</label>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 bg-[#eaf8b2] p-4 text-sm rounded-2xl">
                            <p>{chargeHelperText}</p>
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
                            onSuccess={() => onSuccess()}
                            />
                        </Elements>
                    </div>
                </STKCard>
            </div>
        </div>

    );
};

export default StripeCheckout;
