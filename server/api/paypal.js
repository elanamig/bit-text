const router = require('express').Router();
const axios = require('axios');
const paypalClient = require('paypal-rest-sdk');
const {paypal} = require('../../secrets')
paypalClient.configure(paypal)
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
      }
      console.log(JSON.stringify(paymentObj))
      paypalClient.payment.create(JSON.stringify(paymentObj,function(err, payment) {
          if(err) console.log(err)
          else console.log(payment, 'payment was MADE YO')
      }))
})
module.exports = router;
