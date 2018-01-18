const paypalClient = require('paypal-rest-sdk');
const Platform = require ('./Platform');

class Paypal extends Platform {
    constructor(paypal) {
        super ();
        paypalClient.configure(paypal)
    }
    
    sendPayment(payer, payee, amount, message, cb) {
        console.log("cb in paypal", cb)
        console.log ("sending message in paypal: ", payer.paymentType.authkey, payee.paymentType.authkey)
        const paymentObj = this.generatePaymentObject(payer.paymentType.authkey, payee.paymentType.authkey, amount, message);
        const callbackFunc = super.generateCallbackFunction(payer, payee, amount, cb);
        paypalClient.payment.create(paymentObj, callbackFunc)
    }
    
    generatePaymentObject (fromEmail, toEmail, amount, message) {
        return  {
            intent: 'sale',
                payer: {
                payment_method: 'paypal',
                payer_info: {
                    email: fromEmail,
                }
            },
            transactions: [
            {
                amount: {
                    total: amount,
                    currency: 'USD',
                },
                payee: {
                    email: toEmail
                },
                description: 'The payment transaction description.',
                invoice_number: '48787589673',
                payment_options: {
                    allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                },
                    soft_descriptor: 'ECHI5786786',
                    note_to_payee: message
            }],
            redirect_urls: {
                return_url: 'http://localhost:1337/itworks',
                cancel_url: 'http://localhost:1337/payments/cancel'
            }
        }
    }
}

module.exports = Paypal;