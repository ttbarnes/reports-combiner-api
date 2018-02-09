/* eslint-disable */
import User from '../models/user';
import {
  getUserExchangeKeys,
  updateUserExchangeKeys
} from '../controllers/user';
import { getExchangeData } from '../controllers/exchanges';
import { encrypt } from '../utils/userExchangeKeys';

export const load = (req, res, next, id) => {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

export const getUser = (req, res, user) => {
  return User.get(req.params.userId)
    .then(data => res.json(data))
    .catch(e => res.json({ error: true }));
};

export const create = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  return newUser.save((err) => {
    if (err) {
      return res.status(400).send({ success: false, message: 'Cannot create new user - probably exists' });
    }
    return res.json({ success: true, message: 'Successfully created a new user' });
  });
};


export const exchangeKeys = (req, res) => {
  const encrypted = {
    key: encrypt(req.body.apiKey),
    secret: req.body.apiSecret ? encrypt(req.body.apiSecret) : ''
  };

  const encrypObj = {
    userId: req.body.userId,
    name: req.body.name,
    key: encrypted.key,
    secret: encrypted.secret
  };

  return updateUserExchangeKeys(req, res, encrypObj);
}

export const exchangeData = (req, res) => {
  getUserExchangeKeys(req.params.userId).then((exchangeKeys) => {
    if (!exchangeKeys.length) {
      return res.status(401).send({ error: 'No exchanges integrated'});
    }
    let allData = [];
    exchangeKeys.forEach((e, index) => {
      const isLast = exchangeKeys.length === index + 1;
      getExchangeData(e).then((exchangeData) => {
        allData.push({
          name: e.name,
          data: exchangeData
        });
        // temp solution to get last item
        // for each sould be in promise in seperate function
        if (isLast) {
          return res.json(allData);
        }

      });
    });

  });
}


/* eslint-enable */
