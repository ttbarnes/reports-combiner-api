/* eslint-disable */
import User from '../models/user';
import {
  updateValidExchangeKeys,
  getExchangeTradeHistory
} from '../controllers/userExchangesHandler';
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

export const createUser = (req, res) => {
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

export const updateUser = (req, res, user) => {
  return user.save()
    .then((saved) => {
      // TODO: better way of excluding such fields
      let resObj = saved;
      resObj.password = undefined;
      return res.json(resObj)
    })
    .catch(e => res.json({ error: true }));
};

export const updateUserExchanges = (req, res) => {
  // some exchanges require only secret; some require all 3 fields.
  const encrypted = {
    key: encrypt(req.body.apiKey),
    secret: req.body.apiSecret ? encrypt(req.body.apiSecret) : '',
    passphrase: req.body.passphrase ? encrypt(req.body.passphrase) : ''
  };

  const encrypObj = {
    userId: req.body.userId,
    name: req.body.name,
    key: encrypted.key,
    secret: encrypted.secret,
    passphrase: encrypted.passphrase,
  };

  return updateValidExchangeKeys(req, res, encrypObj);
}

export const getUserCombinedTradeHistory = (req, res) => {
  getUserExchangeKeys(req.params.userId).then((exchangeKeys) => {
    if (!exchangeKeys.length) {
      return res.status(401).send({ errorMessage: 'No exchanges integrated'});
    }
    let allExchanges = [];
    const onComplete = () => res.json(allExchanges);

    let exchangesCount = exchangeKeys.length;

    if (exchangesCount === 0) {
      onComplete();
    } else {
      exchangeKeys.forEach((exchange) => {
        getExchangeTradeHistory(exchange).then((exchangeResult) => {
          allExchanges.push(exchangeResult);
          if (--exchangesCount === 0) {
            onComplete();
          }
        });
      });
    }
  });
}

export const updateUserSubscription = (req, res) => {
  return User.get(req.body._id).then((usr) => {
    usr.subscription = req.body.subscription;
    updateUser(req, res, usr);
  });
};

export const getUserExchangeKeys = (userId) => {
  return User.get(userId).then((usr) => usr.keys); 
}


/* eslint-enable */
