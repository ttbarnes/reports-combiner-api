// @flow
import type { $Request, $Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { decrypt } from '../utils/userExchangeKeys';

const getToken = (headers: Object): string | null => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
};

export function checkTokenGetUserData(req: $Request, res: $Response): $Response {
  const token = getToken(req.headers);
  if (token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err: string, decoded: Object): $Response | string => {
      if (err) {
        if (err.message === 'jwt expired') {
          return res.status(401).send({ success: false, message: 'token expred' });
        }
      }

      return User.findOne({
        username: decoded.data.username
      }, (err: any, user: Object): $Response | string => {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({ errorCheckingToken: true });
        }
        if (user) {
          let decryptedKeys = [];
          user.keys.map((k: Object) => {

            let decryptedObj = {};
            decryptedObj = {
              key: decrypt(k.key),
              secret: decrypt(k.secret),
              passphrase: decrypt(k.passphrase),
              name: k.name
            };

            decryptedKeys.push(decryptedObj);
          });

          const resUserObj = {
            _id: user._id,
            username: user.username,
            keys: decryptedKeys,
            subscription: user.subscription
          };

          return res.status(200).send({ success: true, resUserObj });
        }
        return err;
      });

    });
  }
  return res.status(403).send({ success: false, message: 'No token provided' });
}

