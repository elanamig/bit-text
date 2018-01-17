const twilio = require('twilio');
const accountSid = 'AC70f21dcb69aca250769e5019a19cc209'; // Your Account SID from www.twilio.com/console
const authToken = '196411435e0dd240682917eaf85fb964';   // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);
module.exports = client