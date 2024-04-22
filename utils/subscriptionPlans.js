import {
    FREE_SUBSCRIPTION_PLAN,
    PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
    PREMIUM_SUBSCRIPTION_PLAN
} from "../models/Subscription";

const plans = [
    {
        name: 'Free',
        extensionName: "",
        price: '$0',
        priceNumber: 0,
        features: [
            'Limited listening time to select stories',
            'Limited to 3 profiles',
            'Limited story recording time (60 minutes)',
            'Can add artwork to your own stories'
        ],
        isSelected: selectedPlan.value === FREE_SUBSCRIPTION_PLAN,
        value: FREE_SUBSCRIPTION_PLAN
    },
    {
        name: 'Premium',
        extensionName: "",
        price: '$10',
        priceNumber: 10,
        features: [
            'Unlimited listening time to all stories',
            'Limited to 5 profiles',
            'More story recording time (300 minutes)',
            'Can add artwork to any stories',
            'AI Story Idea Generator for endless inspiration'
        ],
        isSelected: selectedPlan.value === PREMIUM_SUBSCRIPTION_PLAN,
        value: PREMIUM_SUBSCRIPTION_PLAN
    },
    {
        name: 'Premium',
        extensionName: "Organizational",
        price: '$300',
        priceNumber: 300,
        features: [
            'Unlimited listening time to all stories',
            'Limited to 5 profiles',
            'Even more story recording (600 minutes)',
            'Can add artwork to any stories',
            'AI Story Idea Generator for endless inspiration',
            'Includes up to 100 premium users'
        ],
        isSelected: selectedPlan.value === PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN,
        value: PREMIUM_ORGANIZATIONAL_SUBSCRIPTION_PLAN
    }
];

export default plans
