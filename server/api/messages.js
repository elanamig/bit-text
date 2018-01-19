const router = require ('express').Router();
const Message = require ('../db/models');
module.exports = router;

router.get('/', (req, res, next) => {
    if (req.user && req.user.id) {
        const userId = req.user.id;
        const type = req.params.type;
        let msgProm;
        if (!type) {
            msgProm = Message.findAllByUserId(userId)
        }
        if (type === 'in') {
            msgProm = Message.findAllByUserId(userId, false, true)
        } else {
            msgProm = Message.findAllByUserId(userId, true, false)
        }

        msgProm.then (res.json).catch (next);
    } else {
        res.status(401).send("Must be logged in to see messages")
    }
})

router.get('/:id', (req, res, next) => {
    if (req.user && req.user.id) {
        Message.findByIdAndUserId(req.params.id, req.user.id).then (res.json).catch(next)
    } else {
        res.status(401).send("Must be logged in to see messages")
    }
})