const customers = require("./models/Customer")
const subscriptions = require("./models/Subscription")


class StripeService {
    constructor({
        secretKey
    }) {
        this.secretKey = secretKey
    }

    get stripe() {
        return require("stripe")(this.secretKey)
    }

   get customers() {
       return customers
   }

   get subscriptions() {
       return subscriptions
   }
}

module.exports = StripeService
