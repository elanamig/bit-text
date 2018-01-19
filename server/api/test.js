const router = require('express').Router();
const axios = require('axios');
const dwolla = require ('dwolla-v2');

const secrets = require('../../secrets');
const dwollaClient = new dwolla.Client(secrets.dwolla)

const PlatformFactory = require ('../senders/PlatformFactory');


router.post('/:platform', (req, res, next) => {
    console.log("req.body, req.params", req.body, req.params);

    const platform = PlatformFactory.getPlatform(req.params.platform);
    if (platform) {
        const paymentObj = platform.generatePaymentObject('4dcb0f17-5fbd-4b14-83cb-affe6c408504', '20')
        dwollaClient.auth.client()
        .then(appToken => {
            appToken.post('transfers', paymentObj)
            .then (resp => {
                console.log("got reply from dwolla", resp)
                res.json(resp);
            })
            .catch (next)
        })
        .catch(next)
        
    } else {
        res.send ("NO platform found")
    }
})
module.exports = router;
