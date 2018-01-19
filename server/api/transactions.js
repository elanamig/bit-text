const router = require ('express').Router();
const Transaction = require ('../db/models');
module.exports = router;

router.get('/', (req, res, next) => {
    if (req.user && req.user.id) {
        const userId = req.user.id;
        const type = req.params.type;
        let msgProm;
        if (!type) {
            msgProm = Transaction.findAllByUserId(userId)
        }
        if (type === 'in') {
            msgProm = Transaction.findAllByUserId(userId, false, true)
        } else {
            msgProm = Transaction.findAllByUserId(userId, true, false)
        }

        msgProm.then (res.json).catch (next);
    } else {
        res.status(401).send("Must be logged in to see messages")
    }
})

router.get('/:id', (req, res, next) => {
    if (req.user && req.user.id) {
        Transaction.findByIdAndUserId(req.params.id, req.user.id).then (res.json).catch(next)
    } else {
        res.status(401).send("Must be logged in to see messages")
    }
})