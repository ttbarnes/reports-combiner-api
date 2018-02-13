// @flow
import type { $Request, $Response } from 'express';
import { version } from '../../package.json';
import { Router } from 'express';
import passport from 'passport';
import {
	getCombinedHistoryLocal,
	getCombinedHistoryLocalCsvUrl
} from '../controllers/combineHistoryLocal';
import login from '../controllers/auth';
import { checkTokenGetUserData } from '../controllers/token';
import {
	updateUserSubscription,
	createUser,
	getUser,
	updateUserExchanges,
	getUserCombinedTradeHistory
} from '../controllers/user';

export default ({ config, db }: any): any => {
	let api = Router();

	// GET combine multiple CSV / XLSX files into one, from 'history-files' directory
	api.route('/poc/combined-history/local')
		.get(getCombinedHistoryLocal);

	// POST create new CSV from multiple CSV/XLSX files, from 'history-files' directory
	// plan is to send the data from a client rather than using local files
	api.route('/poc/combined-history/local/download')
		.get(getCombinedHistoryLocalCsvUrl);

	api.route('/user')
		// POST create new user
		.post(createUser);
	
	// TODO: auth check
	// PUT user exchange keys
	api.route('/user/exchange-keys')
		.put(updateUserExchanges);

	api.route('/user/:userId')
		// GET user
		.get(passport.authenticate('jwt', { session: false }), (req: $Request, res: $Response) => {
			getUser(req, res);
		});

	api.route('/user/:userId/trade-history')
		.get(getUserCombinedTradeHistory);

	// TODO: auth check
	// PUT update user
	api.route('/user/:userId')
		.put(updateUserSubscription);


	// POST user auth/token check, returns user data
	api.route('/auth')
		.post(checkTokenGetUserData);

	// POST user login
	api.route('/auth/login')
		.post(login);


	return api;
};
