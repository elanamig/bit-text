const apiRouter = require('express').Router();
const Transaction = require('../db/models/Transaction');
const User = require('../db/models/User');
const PaymentType = require ('../db/models/PaymentType');

apiRouter.get('/', (req, res, next) => {
    console.log("HIT STATS ROUTE");
    if (!req.user) res.json("User not logged in")
    else {
        PaymentType.findAll({
            where: {
                userId: req.user.id
            },
            include: [{all:true}]
        })
        .then (paymentTypes => {
            return Promise.all(paymentTypes.map (type => Transaction.findAll({ where: {paymentTypeId: type.id}})
                .then (transactions => {
                    console.log("transactions", transactions)
                   
                    //console.log(type)
                    const sentTrans = transactions.filter(trans=> trans.payerId === type.userId);
                    const resTrans = transactions.filter(trans=> trans.payeeId === type.userId);
                    const info = {};
                    info.platform = type.platform;
                    info.numTrans = transactions.length;
                    info.numCompleted = transactions.filter(trans => trans.status==='Completed').length;
                    info.numSent = sentTrans.length
                    info.amtSent = sentTrans.reduce ( (accum, trans) => accum + +trans.amount, 0);
                    info.numReceived = resTrans.length;
                    info.amtReceived = resTrans.reduce ( (accum, trans) => accum + +trans.amount, 0);
                    return info
                })
                .catch(next)
            ))})
        .then ( stats => {
            console.log("in stats.js", stats)
            res.json(stats);  
        }).catch(next)
    }
})

module.exports = apiRouter;