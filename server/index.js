'use strict'; 

const express = require('express');
const path = require('path');
const volleyball = require('volleyball')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const app = express();
const User = require('./db/models/user')
//logging middleware
app.use(volleyball);

//body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  
  secret: 'thisBitcoinThing',

  resave: false,

  saveUninitialized: true
}))
app.use(function (req, res, next) {
  console.log('SESSION: ', req.session);
  next();
});
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      done(null, user);
    })
    .catch(done);
});
//static middleware
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api'));
app.use('/auth', require('./auth')) // include our routes!

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}); // Send index.html for any other requests

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

module.exports = app;