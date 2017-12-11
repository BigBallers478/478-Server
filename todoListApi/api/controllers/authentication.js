const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const config = require('../config/main');

function generateToken(user) {
  return jwt.sign(user, config.secret, { //signs a token with user and the secret key
    expiresIn: 604800 //seconds
  });
}

exports.login = function (req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

exports.register = function(req, res, next) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  if(!email) {
    return res.status(422).send({ error: 'Enter an email.' });
  }

  if(!name) {
    return res.status(422).send({ error: 'Enter your name.' });
  }

 if(!password) {
    return res.status(422).send({ error: 'Enter a password.' });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    if(existingUser) {
      return res.status(422).send({ error: 'That email is already being used.' });
    }
    const user = new User({
      email,
      password,
      profile: {name}
    });

    user.save((err, user) => {
      if (err) { return next(err); }

      const userInfo = setUserInfo(user);
      res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
      });
    });
  });
};
