const dwolla = require ('dwolla-v2');
const Platform = require('./Platform');
const axios = require('axios');

class Stripe extends Platform {
    constructor(dwollaAuth) {
        super();
        console.log("initilized");
      //  console.log("dwolla", dwolla);
        this.dwollaClient = new dwolla.Client(dwollaAuth);
    }

    sendPayment(payer, payee, amount, message, transactionId, cb) {
        console.log("calling stripe payment for transaction", transactionId)
        const paymentObj = this.generatePaymentObject('4dcb0f17-5fbd-4b14-83cb-affe6c408504', amount);
        const callbackFunc = super.generateCallbackFunction(payer, payee, amount, transactionId, cb);
            
        this.dwollaClient.auth.client()
        .then(appToken => {
            appToken.post('transfers', paymentObj)
            .then (res => console.log("got reply from dwolla", res))
            .catch (console.log)
        })
        .catch(console.log)

        callbackFunc(null, "SUCCESSFUL PAYMENT")  
    }
    generatePaymentObject(toauth, paymentAmt) {
        return {
            _links:  {
                destination: {href: `https://api.dwolla.com/funding-sources/${toauth}`},
                source: {href: `https://api.dwolla.com/funding-sources/${toauth}`},
            },
            amount: {
                currency: 'usd',
                value: paymentAmt
            }
        }
    }
}

module.exports = Stripe
