// @flow
import type { $Request, $Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

type ReqType = {
  body: {
    username: string,
    password: string
  }
} & $Request;

function login(req: ReqType, res: $Response): $Response {
  return User.findOne({
    username: req.body.username
  }, (err: any, usr: Object) => {
    if (err) throw err;
    if (!usr) {
      res.status(401).send({ success: false, message: 'User not found.' });
    } else {
      usr.comparePassword(req.body.password, (cPErr: any, isMatch: boolean) => {
        if (isMatch && !cPErr) {
          jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
            data: usr
          }, process.env.JWT_SECRET, (jwtErr: any, token: string): any => {
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
