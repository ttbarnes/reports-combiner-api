/* eslint-disable */
import User from '../models/user';

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
