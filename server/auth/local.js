const router = require('express').Router();
const Users = require('../db/models/User');
router.post('/login', (req, res, next) => {
    //console.log('this is the body', req.body)
   const {email, password} = req.body;
   Users.findOne({
       where: {email, password},
       include: [{all: true}]
   })
   .then((user) => {
       //console.log("Got user, ", user);
    if (!user) res.send(`Invalid username or password`);
    else {
      req.login(user, (err) => {
          if(err) console.log(err, 'this is the error')
          else {
              console.log("sending user", user)
              res.json(user)
          }
      })
      res.end(); // 200 is the default status!
    }
  })
  .catch(next);
})
router.post('/signup', (req, res, next) => {
    Users.create(req.body)
    .then(user => {
        req.login((user, err) => {
            if(err) console.log(err, 'this is a signup err')
            res.json(user)
        })
    })
})
router.post('/logout', (req, res, next) => {
    req.logout()
    res.send(204)
})
router.get('/me', (req, res, next) => {
    //console.log(req.user, 'user')
    res.json(req.user)
})

module.exports = router;