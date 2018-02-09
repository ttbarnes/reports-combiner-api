// @flow
import type { $Request, $Response, $NextFunction } from 'express';
import type { genSalt, hash, $Compare } from 'bcrypt';
import type { $Schema } from 'mongoose';

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
      name: String,
      key: String,
      secret: String,
      passphrase: String
    }
  ],
  subscription: {
    type: String
  }
});

/**
 * Methods
 */
UserSchema.pre('save', function preSave(next: $NextFunction): $NextFunction {
  const user = this;
  if (!user) return next();
  // only hash the password if modified
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt(10, (err: genSalt, salt: genSalt): genSalt => {
    if (err) return next(err);
    return bcrypt.hash(user.password, salt, null, (hashErr: hash, hash: hash): hash => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function comparePassword(passw: $Compare, cb: $Compare) {
  const hash = this.password;

  bcrypt.compare(passw, hash, function (err: $Compare, isMatch: $Compare): $Compare {
    if (err) return cb(err);
    cb(err, isMatch);
  });
};

UserSchema.statics = {
  get(id: string): $Schema {
    return this.findById(id)
      .exec()
      .then((user: $Schema): $Schema | Promise => {
        if (user) {
          return user;
        }
        const err = { error: true };
        return Promise.reject(err);

      });
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
