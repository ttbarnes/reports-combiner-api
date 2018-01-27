// @flow

import { version } from '../../package.json';
import { Router } from 'express';
import getCombinedHistory from './combineHistory';

export default ({ config, db }: Object): Function => {
	let api = Router();

	// combine multiple xlsx files into one
	// from 'history-files' directory
	api.route('/combined-history')
		.get(getCombinedHistory);

	return api;
};
