const customers = require("./models/Customer")
const subscriptions = require("./models/Subscription")
const paymentIntents = require("./models/PaymentIntent")
const setupIntents = require("./models/SetupIntent")
const promoCodes = require("./models/PromoCode")
const coupons = require("./models/Coupon")

module.exports = {
    customers,
    subscriptions,
    paymentIntents,
    setupIntents,
    promoCodes,
    coupons
}
