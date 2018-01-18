const router = require('express').Router();
const axios = require('axios');
const PlatformFactory = require ('../senders/PlatformFactory');


router.post('/:platform', (req, res, next) => {
    console.log("req.body, req.params", req.body, req.params);
    const email = req.body.email.toString()
    const transactionAmount = req.body.transactionAmount.toString()
    const recipientEmail = req.body.recipientEmail.toString()

    const platform = PlatformFactory.getPlatform(req.params.platform);
    if (platform) {
        platform.sendPayment(email, 
                            recipientEmail, 
                            transactionAmount, 
                            "How cool is this", 
                             (str) => {
                                 console.log(str);
                                 res.send(str)
                             });
        
    } else {
        res.send ("NO platform found")
    }
})
module.exports = router;
