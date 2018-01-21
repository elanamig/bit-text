const apiRouter = require('express').Router();
const Message = require('../db/models/Message');
const User = require('../db/models/User');
const PaymentType = require ('../db/models/PaymentType');

apiRouter.get('/', (req, res, next) => {
    console.log("HIT ACCOUNTS ROUTE");
    if (!req.user) res.json("User not logged in")
    else {
        User.findById (req.user.id)
        .then (user => {
            if (user)
                PaymentType.findAll({
                    where: {
                        userId: user.id
                    }
                })
                .then (paymentTypes => {
                    const info = {user, paymentTypes}
                    res.json(info)
                })
                .catch(next)
            else {
                res.json("User not found")
            }
        }).catch(next)
    }
})

module.exports = apiRouter;