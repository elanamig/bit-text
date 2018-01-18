const stripe = require ('stripe');
const Platform = require('./Platform');
class Stripe extends Platform {
    constructor(sKey) {
        super();
        this.stripeClient = stripe(sKey);
    }
    sendPayment(fromEmail, toEmail, amount, message, cb) {
        super.lookupUsers(fromEmail, toEmail)
        .then(users => {
            const payer = users.payer;
            const payee = users.payee;
            if (payee && payer) {
                const paymentObj = this.generatePaymentObject(payer.email, payee.stripeKey, amount, message);
                const callbackFunc = super.generateCallbackFunction(payer, payee, amount, cb);
                this.stripeClient.charges.create(paymentObj)
                .then(charge => {
                    console.log(charge)
                    callbackFunc(null, charge)
                })
                .catch (err => callbackFunc(err, null))
            } else {
                cb(`USERS NOT FOUND ${fromEmail} or ${toEmail}`);
            }
        }).catch(console.log)
    }
    generatePaymentObject(fromEmail, toStripe, paymentAmt, message) {
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