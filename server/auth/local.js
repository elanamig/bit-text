const router = require('express').Router();
const Users = require('../db/models/User');
router.put('/login', (req, res, next) => {
   const {email, password} = req.body;
   Users.findOne({
       where: {email, password}
   })
   .then(function (user) {
    if (!user) throw new Error(404 + 'user not found, try again!');
    else {
      req.session.user = user;
      res.end(); // 200 is the default statues!
    }
  })
  .catch(next);
})
router.delete('/logout', (req, res, next) => {
    req.session.destroy()
    res.send(204)
})
router.get('/me', (req, res, next) => {
    console.log(req.user, 'user')
    res.send(req.session.user)
})

module.exports = router;