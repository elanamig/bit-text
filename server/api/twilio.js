const apiRouter = require('express').Router()
const Message = require('../db/models/Message')
const User = require ('../db').User
const Transaction = require('../db').Transaction
const twilio = require('twilio')
const {twilioClient} = require('../../secrets') 
const MessagingResponse = twilio.twiml.MessagingResponse
const Client = require('../twilio_auth');
const CentralWallet = require('../wallet')
const PlatformFactory = require ('../senders/PlatformFactory')
const CentralUser= {
    id: 3,
    countryCode: '+1',
    email: 'bittext123@gmail.com',
    fullName: 'BitText',
    password: 'adminpassword',
    phone: '+14142693471',
    paymentType:   { id: 5,
        platform: 'PAYPAL',
        authkey: 'bittext123@gmail.com',
        isDefault: true,
        userId: 3 
     }
}

apiRouter.get('/', (req, res) => {
    User.findPlatformUser();
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
    .then(createdMessage => parseMessage(createdMessage))
    //3.  Lookup payer and payee by phone and platform
    .then(parsedMessage => {
        console.log("looking up users", req.body.From, parsedMessage.to);
        //console.log("are payee and payer numbers the same? ", req.body.From === parsedMessage.to);
        const payerPromise = User.findByPhoneAndPlatform (req.body.From, parsedMessage.platform)
        .then (payer=>{
            if (payer) {
                return parsedMessage.originalMessage.update({payerId:payer.id})
                .then (message => payer).catch (console.log)
            } else return null;
        })
        const payeePromise = User.findByPhoneAndPlatform (parsedMessage.to)
        .then (payee => {
            if (payee) {
                return parsedMessage.originalMessage.update({payeeId:payee.id})
                .then (message => payee).catch (console.log)
            } else return null;
        })
        
        return {
            promise: Promise.all([payerPromise, payeePromise]),
            transactionAmount: parsedMessage.transactionAmount,
            messageId: parsedMessage.id
        }
    })
    //4.  Now process the payments   
    .then(transactionInfo => {
        const payerAndPayeePromise = transactionInfo.promise;
        console.log("We got this far in twilio.js");

        payerAndPayeePromise.then (payerAndPayee => {
            //console.log("user and payment information", payerAndPayee)
            const payer = payerAndPayee[0];
            const payee = payerAndPayee[1];
            console.log("got payer and payee", payer, payee)
            //4.a - if either user is missing or missing a payment type, send appropriate error messages
            if (! payee) {
                sendErrorToPayer(payer, req.body.to)
            }
            else if(! (payer.paymentType && payee.paymentType) ) {
                console.log("MISSING PAYMENT TYPES");
                const payerPaymentType = payer.paymentType?payer.paymentType.platform:'missing';
                const payeePaymentType = payee.paymentType?payee.paymentType.platform:'missing';
                createTransaction(payer, payee, payer.paymentType, transactionInfo.messageId, transactionInfo.transactionAmount, "Rejected", `Missing payment types payer: ${payerPaymentType}, payee: ${payeePaymentTypes}`)
                .then(transaction => sendErrorToPayer(payer, payee))
                .catch (console.err)
            //4.b - if both have the same payment type, process it accordingly
            } else { 
                console.log("got payment types");
                const firstTrans =  createTransaction(payer, payee, payer.paymentType, transactionInfo.messageId, transactionInfo.transactionAmount, 'In-Progress', '')
                    
                if (payer.paymentType.platform === payee.paymentType.platform) {
                    console.log("platforms match", payer.paymentType.platform)
                    sendTransaction(payer, payee, transactionInfo)
                    .then((successStatus) => console.log('payment was ' + successStatus ? 'successfull' : 'failed like you'))
                } else {
                    
                    //If the platforms are not the same, utilize the central wallet (which mocks a bank account) to transfer
                    //1. route payment from sender to wallet. 
                    //2. if step 1 succeeds, then pay second half.
                    //3. if step 1 fails, then refund sender.

                   return;
                }
            }
        })
        .catch (console.log) 

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

const sendMessageToPayer = (payer, payee) => {
    const twiml = new MessagingResponse();
    const message = `Cannot process message.  Missing payment infomration for either ${payer.fullName} or ${payee.fullName?payee.fullName:payee}`;
    twiml.message(message)
}

const handleRejectedPayment = (payer, payee, amount, err) => {
    console.log(err)
    twilio.messages.create({
        body: `Payment of ${amount} to ${payee.fullName} has FAILED. \n ${err}`,
        to: payer.phone,  // Text this number
        from: twilioClient.twilioPhone // From a valid Twilio number
    })
}

const handleSuccessfulPayment = (payer, payee, amount, payment) => {
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
}

const parseMessage = createdMessage => {
    //some processing to be done here
    console.log("created message", createdMessage.id);
    const fields = createdMessage.body.split(' ');
    console.log("Fields", fields)
    return ({
        to: fields[0],
        transactionAmount: fields[1],
        platform: fields[2]?fields[2].toUpperCase():null,
        originalMessage: createdMessage
    });
}

// const callback = function (id, status) {
//     let defaults;

//     if (status === 'SUCCESS') defaults= {status: 'Completed'}
//     else defaults= {status: 'Rejected', comments: status}

//     Transaction.update(defaults, {where: {id} })
//         .then(transaction => {
//             console.log('Successful transaction')
//         }).catch (console.log)
// }


const sendTransaction = (payer, payee, transactionInfo) => {
    return firstTrans.then (transaction => {
        const platform = PlatformFactory.getPlatform (payer.paymentType.platform);
        //console.log("callback in twilio", callback)
        console.log("transaction id", transaction.id)
        //process single transaction payment
        //CALLBACK is going to either record success, or record rejection
        const ppPromise = platform.sendPayment(payer, payee, transactionInfo.transactionAmount, "YES", transaction.id, callback)
        console.log(ppPromise);
        return ppPromise.then(payment => {
            console.log("got payment!", payment.result)
            if (payment.result.state === 'created') {
                updateTransaction(transaction.id, 'Completed')
                handleSuccessfulPayment(payer, payee, transactionInfo.transactionAmount, payment.result.id)
                return true;
            } else {
                updateTransaction(transaction.id, 'Rejected');
                handleRejectedPayment(payer, payee, transactionInfo.transactionAmount, payment.result.id)
                return false;
            }
           
        })
        .catch (console.log)
    })
    .catch (console.log)
}

const  createTransaction = (payer, payee, paymentType, messageId, amount, status, comments) => {
    console.log("Creating transacton for message", messageId)
    return Transaction.create({
        status, 
        comments, 
        amount, 
        payeeId: payee.id,
        payerId: payer.id,
        paymentTypeId: paymentType.id,
        messageId
    });
}

const updateTransaction = (id, status, comments) => {
    const defaults = comments? {status, comments} : {status}
    return Transaction.update ( defaults, {where: {id}})
}

module.exports = apiRouter