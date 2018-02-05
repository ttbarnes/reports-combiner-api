/* eslint-disable */

import jwt from 'jsonwebtoken';
import User from '../models/user';
import { decrypt } from '../utils/userExchangeKeys';

const getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
};

export function checkTokenGetUserData(req, res) {
  const token = getToken(req.headers);
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return res.status(401).send({ success: false, message: 'token expred' });
        }
      }

      return User.findOne({
        username: decoded.data.username
      }, (err, user) => {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({ errorCheckingToken: true });
        }
        if (user) {
          let decryptedKeys = [];
          user.keys.map((k) => {

            let decryptedObj = {};
            decryptedObj = {
              key: decrypt(k.key),
              secret: decrypt(k.secret),
              exchange: k.exchange
            };

            decryptedKeys.push(decryptedObj);
          });

          const resUserObj = {
            _id: user._id,
            username: user.username,
            keys: decryptedKeys
          };

          return res.status(200).send({ success: true, resUserObj });
        }
        return err;
      });

    });
  }
  return res.status(403).send({ success: false, message: 'No token provided' });
}

/* eslint-enable */
