const router = require('express').Router();
const Users = require('../db/models/User');
router.post('/login', (req, res, next) => {
    console.log('this is the body', req.body)
   const {email, password} = req.body;
   Users.findOne({
       where: {email, password}
   })
   .then((user) => {
    if (!user) res.send(`Invalid username or password`);
    else {
      req.login(user, (err) => {
          if(err) console.log(err, 'this is the error')
          else res.send(user)
      })
      res.end(); // 200 is the default statues!
    }
  })
  .catch(next);
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