// const http= require('http')
// const express = require('express')
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
// const bodyParser = require('body-parser');
// const app = express();
// app.use(bodyParser.urlencoded({extended: false}))
// app.post('/sms', (req, res) => {
    
//     const twiml = new MessagingResponse();
//     console.log(req.body.Body)
//     twiml.message('askdjfksjdf')
//     res.writeHead(200, {'Content-Type': 'text/xml'})
//     res.end(twiml.toString())
// })
// http.createServer(app).listen(1337, () => {
//     console.log('express server listening on port 1337')
// })

// //whatever server port you have, so in this case 1337, you can use that with
// //ngrok http 1337, for example.
// //then, send the text and this route will respond. 


//TO SEND A MESSAGE:::::::::::::::::::::::::::::::

// const twilio = require('twilio');
// const accountSid = 'AC70f21dcb69aca250769e5019a19cc209'; // Your Account SID from www.twilio.com/console
// const authToken = '196411435e0dd240682917eaf85fb964';   // Your Auth Token from www.twilio.com/console
// const client = new twilio(accountSid, authToken);

// client.messages.create({
//     body: 'OMGITWORKSHOLYMOLY',
//     to: '+14142436597',  // Text this number
//     from: '+14142693471' // From a valid Twilio number
// })
// .then((message) => console.log(message.sid));