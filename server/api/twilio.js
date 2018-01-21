const apiRouter = require('express').Router()
const Message = require('../db/models/Message')
const User = require ('../db').User
const Transaction = require('../db').Transaction
//const twilio = require('twilio')
const twilioClientSecrets = require('../../secrets').twilioClient
const MessagingResponse = require('twilio').twiml.MessagingResponse
const twilioClient = require('../twilio_auth');
const Wallet = require('../wallet');
const CentralWallet = new Wallet();
const PlatformFactory = require ('../senders/PlatformFactory')
const CentralUser= {
    id: 3,
    countryCode: '+1',
    email: 'bittext123@gmail.com',
    fullName: 'BitText',
    password: 'adminpassword',
    phone: '+14142693471',
    paymentTypes:  [ { id: 5,
        platform: 'PAYPAL',
        authkey: 'bittext123@gmail.com',
        isDefault: true,
        userId: 3 
     },
     { id: 6,
        platform: 'STRIPE',
        authkey: 'Some Really Crazy Auth Key Would Go Here',
        isDefault: false,
        userId: 3 
     },
    ]
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
        //console.log("looking up users", parsedMessage);
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
            messageId: parsedMessage.originalMessage.id
        }
    })
    //4.  Now process the payments   
    .then(transactionInfo => {
        const payerAndPayeePromise = transactionInfo.promise;
        console.log("We got this far in twilio.js", transactionInfo);

        payerAndPayeePromise.then (payerAndPayee => {
            //console.log("user and payment information", payerAndPayee)
            const payer = payerAndPayee[0];
            const payee = payerAndPayee[1];
            //console.log("got payer and payee", payer, payee)
            //4.a - if either user is missing or missing a payment type, send appropriate error messages
            if (! payee) {
                return handleRejectedPayment(payer, req.body.to, transactionInfo.transactionAmount, `payee not found...`)
            }
            else if(! (payer.paymentType && payee.paymentType) ) {
                console.log("MISSING PAYMENT TYPES");
                const payerPaymentType = payer.paymentType?payer.paymentType.platform:'missing';
                const payeePaymentType = payee.paymentType?payee.paymentType.platform:'missing';
                return createTransaction(payer, payee, /*payer.paymentType, */transactionInfo.messageId, transactionInfo.transactionAmount, "Rejected", `Missing payment types payer: ${payerPaymentType}, payee: ${payeePaymentType}`)
                .then(transaction => handleRejectedPayment(payer, payee, transactionInfo.transactionAmount, `Cannot process message.  Missing payment infomration for either ${payer.fullName} or ${payee.fullName}`))
                .catch (console.err)
            //4.b - if both have the same payment type, process it accordingly
            } else {  
                console.log(" we are even further.  Matching platforms")
                if (payer.paymentType.platform === payee.paymentType.platform) {
                    console.log("platforms match", payer.paymentType.platform)
                    return sendTransaction(payer, payee, transactionInfo)
                    .then(payment => 
                        payment.result.state === 'created'? handleSuccessfulPayment(payer, payee, transactionInfo.transactionAmount, payment.result.id)
                         : handleRejectedPayment(payer, payee, transactionInfo.transactionAmount, payment.result.id)
                    )
                    .catch(console.log)
                } else { //If the platforms are not the same, utilize the central wallet (which mocks a bank account) to transfer
                    //1. route payment from sender to wallet.
                    CentralUser.paymentType = CentralUser.paymentTypes.find(type=>type.platform === payer.paymentType.platform); 
                    return sendTransaction(payer, CentralUser, transactionInfo)
                    .then (paymentStatus => {
                        //2. if step 1 succeeds, then pay second half.
                        if (paymentStatus.result.state === 'created') {
                            CentralWallet.receivePayment(transactionInfo.transactionAmount, payer.paymentType.platform, paymentStatus.transactionId)
                            CentralUser.paymentType = CentralUser.paymentTypes.find(type=>type.platform === payee.paymentType.platform);
                            return sendTransaction(CentralUser, payee, transactionInfo)
                            .then (payment => {
                                console.log("payment for first transaction", payment)
                                if (payment.result.state === 'created') {
                                    CentralWallet.sendPayment(transactionInfo.transactionAmount, payee.paymentType.platform,payment.transactionId)
                                    return handleSuccessfulPayment(payer, payee, transactionInfo.transactionAmount, payment.result.id)
                                } else {
                                    // if step 2 fails, then refund the sender
                                    return sendTransaction (CentralUser, payer, transactionInfo)
                                           .then (refundPayment => {
                                               if (refundPayment.result.state === 'created') {
                                                   return handleRejectedPayment(payer, payee, transactionInfo.transactionAmount, parefundPaymentyment.result.id)
                                                   CentralWallet.sendPayment(transactionId.transactionAmount, payer.payeePaymentType.platform, refundPayment.transactionId)
                                               } else {
                                                   console.log("WE HAVE A PROBLEM, UNABLE TO REFUND", payer, payee, transactionInfo)
                                                   return;
                                               }
                                           })
                                        }  
                            })
                        }
                        else {//3. if step 1 fails, text sender.
                            return handleRejectedPayment(payer, payee, transactionInfo.transactionAmount, paymentStatus.result.id)
                        }
                    }).catch(console.log)
                }
            }
        })
        .catch (console.log) 

    })
    .catch (console.log);
    res.end();

    // Message.create({sender: req.body.From, recipient: req.body.To, body: req.body.Body})
    // .then(createdMessage => {
    //     const twiml = new MessagingResponse();
    //     twiml.message(`Created Message in Database Successfully, body of message was ${req.body.Body} `)
    //     res.writeHead(200, {'Content-Type': 'text/xml'})
    //     res.end(twiml.toString())
    // })

})

//const sendErrorToPayer = (payer, payee, message) =>  new MessagingResponse().message(message)


const printStatus = (status) => console.log('payment was ' + status ? 'successfull' : 'failed like you')

const handleRejectedPayment = (payer, payee, amount, err) => {
    console.log(err)
    return twilioClient.messages.create({
        body: `Payment of ${amount} to ${payee?payee.fullName:payee} has FAILED. \n ${err}`,
        to: payer?payer.phone:payer,  // Text this number
        from: twilioClientSecrets.twilioPhone // From a valid Twilio number
    })
}

const handleSuccessfulPayment = (payer, payee, amount, payment) => {
    //console.log(twilioClientSecrets.twilioPhone)
    return Promise.all([twilioClient.messages.create({
        body: `You have received ${amount} from ${payer.fullName} via ${payee.paymentType.platform}`,
        to: payee.phone,  // Text this number
        from: twilioClientSecrets.twilioPhone // From a valid Twilio number
    }),
    twilioClient.messages.create({
        body: `Payment of ${amount} successfully sent to ${payee.fullName} via ${payer.paymentType.platform}`,
        to: payer.phone,  // Text this number
        from: twilioClientSecrets.twilioPhone // From a valid Twilio number
    }) ])
}

const parseMessage = createdMessage => {
    //some processing to be done here
    //console.log("created message", createdMessage.id);
    const fields = createdMessage.body.split(' ');
    //console.log("Fields", fields)
    return ({
        to: fields[0],
        transactionAmount: fields[1],
        platform: fields[2]?fields[2].toUpperCase():null,
        originalMessage: createdMessage
    });
}

const sendTransaction = (payer, payee, transactionInfo) => {
    console.log("sending transaction", payer.id)
    return createTransaction(payer, payee, /*payer.paymentType,*/ transactionInfo.messageId, transactionInfo.transactionAmount, 'In-Progress', '')
        .then (transaction => {
            const platform = PlatformFactory.getPlatform (payer.paymentType.platform);
            //console.log("callback in twilio", callback)
            console.log("transaction id", transaction.id)
            //process single transaction payment
            //CALLBACK is going to either record success, or record rejection
            const ppPromise = platform.sendPayment(payer, payee, transactionInfo.transactionAmount, "YES", transaction.id)
            console.log(ppPromise);
            return ppPromise.then(payment => {
                console.log("got payment!", payment.result)
                payment.transactionId = transaction.id
                const status = payment.result.state === 'created' ? 'Completed' : 'Rejected';
                return updateTransaction(transaction.id, status).then( () => payment)
                 })
        }).catch (console.log)
}

const  createTransaction = (payer, payee, /*paymentType,*/ MessageId, amount, status, comments) => {
    console.log("Creating transacton for message messageId, payer.id, payee.id", MessageId, payer.id, payee.id)
    console.log("Is Payer Central User? ", payer===CentralUser)
    let paymentTypeId;
    if (payer === CentralUser) {
        paymentTypeId = payee.paymentType?payee.paymentType.id:null;
    } else {
        paymentTypeId = payer.paymentType?payer.paymentType.id:null;
    }
    const props = {
        status, 
        comments, 
        amount, 
        payeeId: payee.id,
        payerId: payer.id,
        MessageId,
        paymentTypeId
    }

    //if (paymentType) props['paymentTypeId'] = paymentType.id
    console.log("TRANS DONE")
    return Transaction.create(props);
}

const updateTransaction = (id, status, comments) => {
    const defaults = comments? {status, comments} : {status}
    return Transaction.update ( defaults, {where: {id}})
}

module.exports = apiRouter