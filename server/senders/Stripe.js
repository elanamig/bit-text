const stripe = require ('stripe');
const Platform = require('./Platform');
class Stripe extends Platform {
    constructor(sKey) {
        super();
        this.stripeClient = stripe(sKey);
    }

    sendPayment(payer, payee, amount, message, transactionId, cb) {
        console.log("calling stripe payment for transaction", transactionId)
        const paymentObj = this.generatePaymentObject('elanamig@gmail.com', amount);
        const callbackFunc = super.generateCallbackFunction(payer, payee, amount, transactionId, cb);
        this.stripeClient.charges.create(paymentObj)
            .then(charge => {
                console.log(charge)
                callbackFunc(null, charge)
            })
            .catch (err => callbackFunc(err, null))       
    }
    generatePaymentObject(toStripe, paymentAmt) {
        return {
            amount: paymentAmt,
            currency: 'usd',
            source: 'tok_visa',
              //this destination is the object that will allow for sending to specific destination users. I did not fully search through
             //not sending to stripe, but as of now this is the best I could find.
            destination: {
                account: toStripe
            }
        }
    }
}

module.exports = Stripe
