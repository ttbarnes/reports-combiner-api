/* eslint-disable */

import mongoose from 'mongoose';
import Promise from 'bluebird';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema; // eslint-disable-line no-unused-vars

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  keys: [
    {
      exchange: String,
      secret: String,
      key: String
    }
  ]
});

/**
 * Methods
 */
UserSchema.pre('save', function preSave(next) {
  const user = this;
  if (!user) return next();
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(passw, cb) {
  const hash = this.password;
  bcrypt.compare(passw, hash, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = { error: true };
        return Promise.reject(err);
      });
  }
}

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

/* eslint-enable */
