import { NextRequest, NextResponse } from 'next/server'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import supabaseService from "../../../service/supabase"
// @ts-ignore
import Profile from "@/service/models/Profile"
import StripeService from "../../../service/services/StripeService/StripeService"
const StripeAccount = require("../../../service/models/StripeAccount")
const Subscription = require("../../../service/models/Subscription")
const AccountToolsUsage = require("../../../service/models/AccountToolsUsage")

//
const processOauth = async (req: NextRequest, res: NextResponse) => {
    try {
        // @ts-ignore
        const { code } = req.body
        // @ts-ignore
        if (!code) return res.status(400).send({ message: "Code is missing." })
        // @ts-ignore
        const supabase = createPagesServerClient({ req, res })
        const { data, error } = await supabase.auth.exchangeCodeForSession(String(code))

        if (error) {
            // @ts-ignore
            return res.status(400).send({ message: "Something went wrong" })
        }

        let defaultProfile = await Profile.getDefaultAccountProfile({
            accessToken: data.session.access_token,
            accountId: ""
        })

        if (!defaultProfile) {
            defaultProfile = await Profile.createProfile({
                name: data.session?.user?.user_metadata?.full_name,
                avatarUrl: data.session?.user?.user_metadata?.avatar_url
            }, { accessToken: data.session?.access_token })
        }

        // @ts-ignore
        await supabaseService.auth.setSession({
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
        })

        // Let's create a free account as default
        const stripeCustomer = await StripeService.customers.create({ email: data.session?.user?.email })

        const subscription = await StripeService.subscriptions.create({
            customerId: stripeCustomer?.id,
            planId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID
        })

        const stripeAccount = await StripeAccount.create({
            accountId: data.user.id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: stripeCustomer.id
        })

        const { FREE_SUBSCRIPTION_PLAN } = Subscription.getAllowedSubscriptionPlanNames()
        await Subscription.create({
            accountId: data.user.id,
            stripeAccountId: stripeAccount.id,
            subscriptionPlan: FREE_SUBSCRIPTION_PLAN,
        })

        // Let's create the account tools usage configuration
        await AccountToolsUsage.create({ accountId: data.user.id })

        // @ts-ignore
        return res.status(200).send({
            ...data,
            defaultProfile
        })
    } catch (error) {
        console.error(error)
        // @ts-ignore
        return res.status(400).send(error)
    }
}


export default processOauth
