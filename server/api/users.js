const apiRouter = require('express').Router()
const Users = require('../db/models/User');
const client = require('../twilio_auth');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
apiRouter.get('/', (req, res, next) => {
    Users.findAll()
    .then(allUsers => {
        res.json(allUsers)
    })
    .catch(next)
})


apiRouter.post('/', (req, res, next) => {
    client.validationRequests
    .create({
        friendlyName: req.body.fullName,
        phoneNumber: req.body.countryCode + req.body.phone
    })
    .then(data => {
        console.log(data.validationCode)
    })
    .then(() => {
        Users.create(req.body)
        .then(createdUser => {
            const twiml = new MessagingResponse();
            twiml.message(`Thanks for signing up, ${req.body.fullName}!`)
            res.sendStatus(200)
        })
    })
    
});


module.exports = apiRouter;