/* eslint-disable */
import User from '../models/user';

export const update = (req, res, user) => {
  return user.save()
    .then((saved) => {
      // TODO: better way of excluding such fields
      let resObj = saved;
      resObj.password = undefined;
      return res.json(resObj)
    })
    .catch(e => res.json({ error: true }));
};

export const updateUserSubscription = (req, res) => {
  return User.get(req.body._id).then((usr) => {
    usr.subscription = req.body.subscription;
    update(req, res, usr);
  });
};

export const updateUserExchangeKeys = (req, res, newExchangeObj) => {
  return User.get(req.body.userId).then((usr) => {
    let updatedExchanges = [];
    if (usr.keys.length) {
      const exchangeExists = usr.keys.find((k) => k.name === newExchangeObj.exchange);

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

/* eslint-enable */
