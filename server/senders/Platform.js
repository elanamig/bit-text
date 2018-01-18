const twilio = require ('../twilio_auth');
const {twilioClient} = require('../../secrets') 
const User = require('../db').User;
const PaymentType = require ('../db').PaymentType;

module.exports = class Platform {
    constructor () {
    }
    
    lookupUsers (fromPhone, toPhone) {
        const fromObj = User.findByPhone(fromPhone);
        const toObj = User.findByPhone(toPhone);
        return Promise.all([fromObj, toObj])
        .then (users => {
           const userObj = {
                payer: users[0],
                payee: users[1]
            }
            return userObj;
        });
    }

    verifyUsers (fromPhone, toPhone, fromPlatform, toPlatform) {
        return lookupUsers (fromPhone, toPhone)
        .then (users => {
            if(! (users[0] || users[1] )) {
                return new Promise((resolve, reject) => null)
            }
            const paymentLookup = users.map (user => PaymentType.findByUserIdAndPlatform (user.id));
            return Promise.all(paymentLookup)
            .then(payments => {
                users[0].paymentType = payments[0];
                users[0].paymentType = payments[1];
            })
        })
    }

    generateCallbackFunction(payer, payee, amount, cb) {
        console.log(cb)
        return (err, payment) => {
            if(err) {
                console.log(err)
                twilio.messages.create({
                    body: `Payment of ${amount} to ${payee.fullName} has FAILED. \n ${err}`,
                    to: payer.phone,  // Text this number
                    from: twilioClient.twilioPhone // From a valid Twilio number
                })
                cb('ERROR')
                    
            } else {
                console.log(twilioClient.twilioPhone)
                twilio.messages.create({
                    body: `You have received ${amount} from ${payer.fullName}`,
                    to: payee.phone,  // Text this number
                    from: twilioClient.twilioPhone // From a valid Twilio number
                })
                twilio.messages.create({
                    body: `Payment of ${amount} successfully sent to ${payee.fullName}`,
                    to: payer.phone,  // Text this number
                    from: twilioClient.twilioPhone // From a valid Twilio number
                })
                cb('SUCCESS') 
            }

        }
    }

}