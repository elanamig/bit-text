const apiRouter = require('express').Router();
const Message = require('../db/models/Message');
const User = require('../db/models/User');

apiRouter.get('/', (req, res, next) => {
    console.log("HIT ACCOUNTS ROUTE");
    if (!req.user) res.json("User not logged in")
    else {
        User.findById (req.user.id)
        .then (user => {
            if (user)
                Message.findAllByUserId(user.id)
                .then (messages => {
                    const info = {user, messages}
                    console.log("Sending account info from accounts.js", info)
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