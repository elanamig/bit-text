const twilio = require ('../twilio_auth');
const {twilioClient} = require('../../secrets') 
const User = require('../db').User;

module.exports = class Platform {
    constructor () {
    }
    
    lookupUsers (fromEmail, toEmail) {
        const fromObj = User.findByEmail(fromEmail);
        const toObj = User.findByEmail(toEmail);
        return Promise.all([fromObj, toObj])
        .then (users => {
            const userObj = {
                payer: users[0],
                payee: users[1]
            }
            return userObj;
        });
    }

    generateCallbackFunction(payer, payee, amount, cb) {
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