const router = require('express').Router();
const Message = require('../db/models/Message');
const User = require('../db/models/User');

router.get('/', (req, res, next) => {
    console.log("got message request.  userLoggedIn", req.user?"yes":"no")
    if (req.user) {  
        const find = req.query.payee === 'true'?Message.findAllPayee(req.user.id):Message.findAllPayer(req.user.id)
        find
        .then(messages => res.json(messages))
        .catch(next)
    } else {
        res.send(null);
    }
})
router.put('/:id', (req, res, next) => {
    console.log("got put request", req.body, req.user.id, req.params.id)
    Message.removeFromView (req.user.id, req.params.id, req.body.payee).then(message => { 
        console.log('deleted number: ' + message[0], message[0]?"true":"false")
        res.json(message[0]);
    })
    .catch(next)
})

module.exports = router;


