const twilio = require('twilio'); 
const {twilioClient} = require('../secrets')  // Your Auth Token from www.twilio.com/console
const client = new twilio(twilioClient.accountSid, twilioClient.authToken);
module.exports = client