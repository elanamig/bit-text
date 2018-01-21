const stripe = require ('stripe');
const Platform = require('./Platform');
class Stripe extends Platform {
    constructor(sKey) {
        super();
        this.stripeClient = stripe(sKey);
    }

    sendPayment(payer, payee, amount, message, transactionId, cb) {
        console.log("calling stripe payment for transaction", transactionId)
        const paymentObj = this.generatePaymentObject('cus_CA8cJFFfl5rakn', amount);
        const callbackFunc = super.generateCallbackFunction(payer, payee, amount, transactionId, cb);
        // this.stripeClient.charges.create(paymentObj)
        //     .then(charge => {
        //         console.log(charge)
        //         callbackFunc(null, charge)
        //     })
        //     .catch (err => callbackFunc(err, null))  
        const resolve = () => console.log("resoved");
        const reject = () => console.log("reject");
        return new Promise((resolve, reject) => {
            resolve({
                result: {
                    state: 'created',
                    message: `successfully sent $${amount} to ${payee.fullName} from ${payer.fullName}`,
                    id: `${new Date().getTime()}`
                }
            })
        })   
    }
    generatePaymentObject(toStripe, paymentAmt) {
        return {
            amount: paymentAmt,
            currency: 'usd',
            source: 'tok_visa',
            destination: {
                account: 'cus_CA8cJFFfl5rakn'
            }
        }
    }
}

module.exports = Stripe
