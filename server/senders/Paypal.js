const paypalClient = require('paypal-rest-sdk');
const Platform = require ('./Platform');

class Paypal extends Platform {
    constructor(paypal) {
        super ();
        paypalClient.configure(paypal)
    }
    
    sendPayment(fromEmail, toEmail, amount, message, cb) {
        super.lookupUsers(fromEmail, toEmail)
        .then(users => {
            const payer = users.payer;
            const payee = users.payee;
            if (payee && payer) {
                const paymentObj = this.generatePaymentObject(payer.email, payee.email, amount, message);
                const callbackFunc = super.generateCallbackFunction(payer, payee, super.getTwilioClient(), amount, cb);
                paypalClient.payment.create(paymentObj, callbackFunc)
            } else {
                cb(`USERS NOT FOUND ${fromEmail} or ${toEmail}`);
            }
        }).catch (console.log)
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