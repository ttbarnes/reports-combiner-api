// @flow
import type { $Request, $Response } from 'express';
import express from 'express';
import passport from 'passport';
import {
  updateUserSubscription,
  createUser,
  getUser,
  updateUserExchanges,
  getUserTradeHistory,
  addUserTradeHistoryNote
} from '../controllers/user';
import {
  getCombinedHistoryLocal,
  getCombinedHistoryLocalCsvUrl
} from '../controllers/combineHistoryLocal';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  // POST create new user
  .post(createUser);

// TODO: auth check
// PUT user exchange keys
router.route('/exchange-keys')
  .put(updateUserExchanges);

router.route('/:userId')
  // GET user
  .get(passport.authenticate('jwt', { session: false }), (req: $Request, res: $Response) => {
    getUser(req, res);
  });

// TODO: maybe have separate trade-history/snapshot endpoint
router.route('/:userId/trade-history')
  .get(getUserTradeHistory);

  // PUT note to trade-history
router.route('/trade-history/note')
  .put(addUserTradeHistoryNote);

// TODO: auth check
// PUT update user
router.route('/:userId')
  .put(updateUserSubscription);
  

export default router;
