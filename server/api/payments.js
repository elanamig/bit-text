const router = require('express').Router();
const PaymentTypes = require('../db/models/PaymentType');

router.post('/', (req, res, next) => {
       
    if(req.user) {
        PaymentTypes.findOrCreate({where: {userId: req.user.id, platform: req.body.platform}}).then(([dat, wasCreated]) => {
            if(wasCreated) {
                dat.setUser(req.user.id)
                res.json(true)
            } else {
                res.json(false)
            }
        })
    } else {
        res.send('please sign in to add payment method')
    }
    
})
module.exports = router;