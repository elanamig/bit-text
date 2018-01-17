const router = require('express').Router();
const axios = require('axios');
const twilioClient = require('../twilio_auth');

router.get('/', (req, res, next) => {

})
router.post('/', (req, res, next) => {
    const email = req.body.email.toString()
    const transactionAmount = req.body.transactionAmount.toString()
    const recipientEmail = req.body.recipientEmail.toString()
    const paymentObj = {
        intent: 'sale',
         payer: {
         payment_method: 'paypal',
         payer_info: {
            email: email,
        }
        },
        transactions: [
        {
          amount: {
            total: req.body.transactionAmount.toString(),
            currency: 'USD',
          },
          payee: {
            email: req.body.recipientEmail.toString()
          },
          description: 'The payment transaction description.',
          invoice_number: '48787589673',
          payment_options: {
          allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
          },
          soft_descriptor: 'ECHI5786786',
          
        }
        ],
        note_to_payer: 'Contact us for any questions on your order.',
        redirect_urls: {
            return_url: 'http://localhost:1337/itworks',
            cancel_url: 'http://localhost:1337/payments/cancel'
        }
      }
      paypalClient.payment.create(JSON.stringify(paymentObj),function(err, payment) {
          if(err) {console.log(err.response.details, 'this is the error')}
          else {
              console.log(payment, 'payment was MADE YO')
              twilioClient.messages.create({
                body: JSON.stringify(payment),
                to: '+19174594647',  // Text this number
                from: '+14142693471' // From a valid Twilio number
                })
        }
      })
})
module.exports = router;
