const passport = require('passport'),
  User = require('../models/userModel'),
  config = require('./main'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local');

// Setting username field to use email rather than username
const localOptions = {
  usernameField: 'email'
};

// Sets up a local login
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { error: 'Login details could not be verified. Try again.' }); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { error: 'Login details could not be verified. Try again.' }); }

      return done(null, user);
    });
  });
});

// Setting JWT strategy options
const jwtOptions = {
  // Tells Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Tells Passport where to find the secret key
  secretOrKey: config.secret

};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
