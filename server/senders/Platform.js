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
}