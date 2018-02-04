// @flow

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
	update
} from './user';

// todo: learn to use real type definitions for express
type ReqType = { body?: Object };
type ResType = { json: Function, download: Function };


export default ({ config, db }: Object): Function => {
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

	// POST create new user
	api.route('/user')
		.post(create);

	// PUT update user
	api.route('/user/:userId')
		.put(passport.authenticate('jwt', { session: false }), (req: ReqType, res: ResType) => {
			update(req, res);
		});

	// POST user auth/token check, returns user data
	api.route('/auth')
		.post(checkTokenGetUserData);

	// POST user login
	api.route('/auth/login')
		.post(login);

	return api;
};
