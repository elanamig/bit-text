const twilio = require ('../twilio_auth');
const {twilioClient} = require('../../secrets') 
const User = require('../db').User;

module.exports = class Platform {
    constructor () {
    }

    getTwilioClient () {
        return twilio;
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

    getPhoneNumber () {
        return twilioClient.twilioPhone;
    }
    generateCallbackFunction(payer, payee, twilioMain, amount, cb) {
        return (err, payment) => {
            if(err) {
                console.log(err)
                twilioClient.messages.create({
                    body: `Payment of ${amount} to ${payee.fullName} has FAILED. \n ${err}`,
                    to: payer.phone,  // Text this number
                    from: super.getPhoneNumber() // From a valid Twilio number
                })
                cb('ERROR')
                    
            } else {
                console.log(twilioClient.twilioPhone)
                twilioMain.messages.create({
                    body: `You have received ${amount} from ${payer.fullName}`,
                    to: payee.phone,  // Text this number
                    from: this.getPhoneNumber() // From a valid Twilio number
                })
                twilioMain.messages.create({
                    body: `Payment of ${amount} successfully sent to ${payee.fullName}`,
                    to: payer.phone,  // Text this number
                    from: this.getPhoneNumber() // From a valid Twilio number
                })
                cb('SUCCESS') 
            }

        }
    }

}