const apiRouter = require('express').Router()
const Message = require('../db/models/Message')
const User = require ('../db').User;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const Client = require('../twilio_auth');
const PlatformFactory = require ('../senders/PlatformFactory')
apiRouter.get('/', (req, res) => {
    Client.messages.create({
        body: 'Thank you for sending the preceding message!',
        to: '',  // Text this number
        from: '+14142693471' // From a valid Twilio number
        })
})
apiRouter.post('/sms', (req, res, next) => {
    //1.  Store received message in DB
    Message.create({sender: req.body.From, recipient: req.body.To, body: req.body.Body})
    //2. parse message body
    .then(createdMessage => parseMessage(createdMessage.body))
    //3.  Lookup payer and payee by phone and platform
    .then(parsedMessage => {
        console.log("looking up users", req.body.From, parsedMessage.to);
        console.log("are payee and payer numbers the same? ", req.body.From === parsedMessage.to);
        const payerPromise = User.findByPhoneAndPlatform (req.body.From, parsedMessage.platform)
        const payeePromise = User.findByPhoneAndPlatform (parsedMessage.to)
        
        return {
            promise: Promise.all([payerPromise, payeePromise]),
            transactionAmount: parsedMessage.transactionAmount
        }
    })
    //4.  Now process the payments   
    .then(transactionInfo => {
        const payerAndPayeePromise = transactionInfo.promise;
        console.log("We got this far in twilio.js");

        payerAndPayeePromise.then (payerAndPayee => {
            console.log("user and payment information", payerAndPayee)
            const payer = payerAndPayee[0];
            const payee = payerAndPayee[1];
            //4.a - if either user is missing a payment type, send appropriate error messages
            if(! (payer.paymentType && payee.paymentType) ) {
                console.log("MISSING PAYMENT TYPES");
                sendErrorToPayer(payerAndPayee);
            } else { //if both have payment info, check to see if it's the same. 
                console.log("got payment types") 
                if (payer.paymentType.platform === payee.paymentType.platform) {
                    const platform = PlatformFactory.getPlatform (payer.paymentType.platform);
                    console.log("callback in twilio", callback)
                    //process single transaction payment
                    platform.sendPayment(payer, payee, transactionInfo.transactionAmount, "YES", callback)
                    //todo - update DB status
                } else {
                    //todo
                }
            }
        }) 

    })
    .catch (console.log);


    Message.create({sender: req.body.From, recipient: req.body.To, body: req.body.Body})
    .then(createdMessage => {
        const twiml = new MessagingResponse();
        twiml.message(`Created Message in Database Successfully, body of message was ${req.body.Body} `)
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
    })

})

const sendMessageToPayer = (payerAndPayee) => {
    const twiml = new MessagingResponse();
    const message = `Cannot process message.  Missing payment infomration for either ${payerAndPayee[0].fullName} or ${payerAndPayee[0].fullName}`;
    twiml.message(message)
}

const parseMessage = createdMessage => {
    //some processing to be done here
    console.log("created message", createdMessage);
    const fields = createdMessage.split(' ');
    console.log("Fields", fields)
    return ({
        to: fields[0],
        transactionAmount: fields[1],
        platform: fields[2]
    });
}

const callback = function (status) {
    console.log(`Indeed, I was called back with status ${status}`);
}


module.exports = apiRouter