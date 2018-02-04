/* eslint-disable */

import User from '../models/user';

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

export const update = (req, res, user) => {
  return user.save()
    .then(saved => res.json(saved))
    .catch(e => res.json({ error: true }));
};

/*
export const updateUserKeys = (req, res, newExchangeObj) => {
  return User.get(req.body.userId).then((usr) => {
    let updatedExchanges = [];
    if (usr.keys.length) {
      const exchangeExists = usr.keys.find((k) => k.exchange === newExchangeObj.exchange);

      usr.keys.map((k, i) => {
        const isLastItem = i === usr.keys.length - 1;
        if (exchangeExists) {
          updatedExchanges = [
            ...updatedExchanges,
            k
          ];
          return updatedExchanges;
        }
        if (!exchangeExists && isLastItem) {
          updatedExchanges = [
            ...usr.keys,
            newExchangeObj
          ];
          return k;
        }
        return k;
      });
      usr.keys = updatedExchanges;
    } else {
      usr.keys = [newExchangeObj];
    }
    update(req, res, usr);
  });
}
*/

/* eslint-enable */
