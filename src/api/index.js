// @flow
import type { $Request, $Response } from 'express';

import { version } from '../../package.json';
import { Router } from 'express';
import passport from 'passport';
import { get } from './combineHistory';
import {
	getCombinedHistoryLocal,
	getCombinedHistoryLocalCsvUrl
} from './combineHistoryLocal';

import login from './auth';
import { checkTokenGetUserData } from './token';
import {
	create,
	getUser,
	exchangeKeys,
	exchangeData
} from './user';
import { updateUserSubscription } from '../controllers/user';


export default ({ config, db }: Object): $Response => {
	let api = Router();

	// GET combined trade history from exchanges
	api.route('/combined-history')
		.get(get);

	// GET combine multiple CSV / XLSX files into one, from 'history-files' directory
	api.route('/combined-history/local')
		.get(getCombinedHistoryLocal);

	// POST create new CSV from multiple CSV/XLSX files, from 'history-files' directory
	// plan is to send the data from a client rather than using local files
	api.route('/combined-history/local/download')
		.get(getCombinedHistoryLocalCsvUrl);

	api.route('/user')
		// POST create new user
		.post(create);
	
	// TODO: auth check
	// PUT user exchange keys
	api.route('/user/exchange-keys')
		.put(exchangeKeys);

	api.route('/user/:userId')
		// GET user
		.get(passport.authenticate('jwt', { session: false }), (req: $Request, res: $Response) => {
			getUser(req, res);
		});

	api.route('/user/:userId/exchange-data')
		.get(exchangeData);

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
