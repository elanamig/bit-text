const paypalClient = require('paypal-rest-sdk');


class Paypal {
    constructor(paypal) {
        paypalClient.configure(paypal)
    }
    paymentCb(err, payment) {
        if(err) {
            console.log(err)
            //NOTIFY SENDER THAT THERE IS AN ERROR ETC
        } else {
            twilioClient.messages.create({
                body: JSON.stringify(payment),
                to: '+19174594647',  // Text this number
                from: '+14142693471' // From a valid Twilio number
                })
        }
    }
    sendPayment(fromEmail, toEmail, amount, message) {
        const paymentObj = {
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
            }
            ],
            redirect_urls: {
                return_url: 'http://localhost:1337/itworks',
                cancel_url: 'http://localhost:1337/payments/cancel'
            }
          }

    }
}

module.exports = Paypal;