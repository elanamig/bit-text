'use strict'
const apiRouter = require('express').Router()
const db = require('../db')
apiRouter.use('/twilio', require('./twilio'))
apiRouter.use('/users', require('./users'))
apiRouter.use('/paypal', require('./paypal'))
apiRouter.use('/test', require ('./test'));
apiRouter.use('/messages', require('./messages'));
apiRouter.use('/transactions', require('./transactions'));

apiRouter.get('/hello', (req, res) => {
	console.log(req.session)
	res.send('laksdjf')

})

// You can put all routes in this file; HOWEVER, this file should almost be like a table of contents for the routers you create

module.exports = apiRouter;