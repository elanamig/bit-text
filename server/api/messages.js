const router = require('express').Router();
const Message = require('../db/models/Message');
const User = require('../db/models/User');

router.get('/', (req, res, next) => {
    console.log(req.user.phone)
    Message.findAll({ 
        where: {payeeId: req.user.id},
        include: [
            {model: User, as: 'payer' , attributes: ['fullName', 'email', 'phone']}
        ]
    
    })
    .then(messages => {
        console.log('these are msgs', messages)
        res.send(messages)
    })
    .catch(next)
})
router.delete('/:id', (req, res, next) => {
    Message.destroy({where: {id: req.body.id}}).then(() => console.log('deleted number: ' + req.body.id))
})

module.exports = router;


