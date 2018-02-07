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
      name: String,
      key: String,
      secret: String
    }
  ],
  subscription: {
    type: String
  }
});

/**
 * Methods
 */
UserSchema.pre('save', function preSave(next) {
  const user = this;
  if (!user) return next();
  // only hash the password if modified
  if (!user.isModified('password')) return next();

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

  bcrypt.compare(passw, hash, function (err, isMatch) {
    if (err) return cb(err);
    cb(err, isMatch);
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
