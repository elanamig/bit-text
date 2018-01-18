const apiRouter = require('express').Router()
const Message = require('../db/models/Message')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const Client = require('../twilio_auth');
apiRouter.get('/', (req, res) => {
    Client.messages.create({
        body: 'Thank you for sending the preceding message!',
        to: '',  // Text this number
        from: '+14142693471' // From a valid Twilio number
        })
})
apiRouter.post('/sms', (req, res) => {
    Message.create({sender: req.body.From, recipient: req.body.To, body: req.body.Body})
    .then(createdMessage => {
        const twiml = new MessagingResponse();
        twiml.message(`Created Message in Database Successfully, body of message was ${req.body.Body} `)
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
    })

})

module.exports = apiRouter