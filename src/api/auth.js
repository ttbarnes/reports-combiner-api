/* eslint-disable */
import jwt from 'jsonwebtoken';
import User from '../models/user';

function login(req, res) {
  return User.findOne({
    username: req.body.username
  }, (err, usr) => {
    if (err) throw err;
    if (!usr) {
      res.status(401).send({ success: false, message: 'User not found.' });
    } else {
      usr.comparePassword(req.body.password, (cPErr, isMatch) => {
        if (isMatch && !cPErr) {
          jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
            data: usr
          }, process.env.JWT_SECRET, (jwtErr, token) => {
            if (jwtErr) {
              return jwtErr;
            }
            res.json({ success: true, token: `JWT ${token}`, userId: usr._id });
          });
        } else {
          res.json({ success: false, message: 'Incorrect password.' });
        }
      });
    }
  });
}

export default login;

/* eslint-enable */
