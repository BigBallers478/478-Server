'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  name: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function (next) {//this hashes passwords with salt before saving it to the database
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => { //uses bcrypt to hash password
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//This method compares passwords for logging in
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);

