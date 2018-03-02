/* eslint-disable */
import User from '../models/user';
import {
  updateValidExchangeKeys,
  getExchangeTradeHistory
} from '../controllers/userExchangesHandler';
import {
  createSnapshot,
  getSnapshot,
  handleGetSnapshot,
  createSnapshotResponseObj,
  updateSnapshotNote
} from './snapshot';
import { encrypt } from '../utils/userExchangeKeys';
import createMasterHistory from '../utils/masterHistory';

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

export const getUserById = (userId) => {
  return User.get(userId)
    .then(data => data)
    .catch(e => { error: true });
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

// todo: refactor updateUser
export const updateUserWithoutResJson = (user) => {
  return user.save()
    .then((saved) => {
      // TODO: better way of excluding such fields
      let resObj = saved;
      resObj.password = undefined;
      return resObj;
    })
    .catch(e => { error: true });
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

/*
* getUserTradeHistory
*
* with user exchange keys, get trade history from each exchange API 
* reformat/merge the fields into a generic 'masterHistory' format
* add/update user's snapshotId
*/
export const getUserTradeHistory = (req, res) => {
  getUserExchangeKeys(req.params.userId).then((exchangeKeys) => {
    if (!exchangeKeys.length) {
      return res.status(404).send({ errorMessage: 'No exchanges integrated.'});
    }
    let allExchanges = [];
    const onComplete = () => {
      if (allExchanges.trades) {
        const tradeHistory = createMasterHistory(allExchanges);
        return handleGetSnapshot(res, tradeHistory, req.params.userId); 
      }
      return res.json({ error: 'No trades' });
    };

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
        }, (err: any) =>
          onComplete()
        );
      });
    }
  });
}

/*
* addUserTradeHistoryNote
*
* get user's snapshotId
* update a snapshot's row's 'note', via snapshotId and rowId
* returns updated snapshot trades (does not include 'fields' array)
*/
export const addUserTradeHistoryNote = (req, res) => {
  return User.get(req.body.userId).then((usr) => {
    const snapshotId = usr.snapshotId;
    return getSnapshot(usr.snapshotId).then((snapshot: Object): $Response => {
      return updateSnapshotNote(snapshotId, req.body.rowId, req.body.note).then((updatedSnapshot): $Response => {
        return res.json(updatedSnapshot);
      }, (err: Object): $Response => {
        return res.json(err);
      });
    });
  });  
}

export const updateUserSubscription = (req, res) => {
  return User.get(req.body._id).then((usr) => {
    usr.subscription = req.body.subscription;
    updateUser(req, res, usr);
  });
};

export const updateUserSnapshotId = (userId, snapshotId) => {
  return User.get(userId).then((usr) => {
    usr.snapshotId = snapshotId;
    return updateUserWithoutResJson(usr);
  });
};

export const getUserExchangeKeys = (userId) => {
  return User.get(userId).then((usr) => usr.keys);
}


/* eslint-enable */
