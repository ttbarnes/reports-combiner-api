// @flow

import { version } from '../../package.json';
import { Router } from 'express';
import { get } from './combineHistory';
import {
	getCombinedHistoryLocal,
	getCombinedHistoryLocalCsvUrl
} from './combineHistoryLocal';

export default ({ config, db }: Object): Function => {
	let api = Router();

	api.route('/combined-history')
		/*
		* GET: combined trade history from exchanges
		*/
		.get(get);

	api.route('/combined-history/local')
		/*
		* GET: combine multiple CSV/XLSX files into one, from 'history-files' directory
		*/
		.get(getCombinedHistoryLocal);

	api.route('/combined-history/local/download')
		/*
		* POST: create new CSV from multiple CSV/XLSX files, from 'history-files' directory
		* plan is to send the data from a client rather than using local files
		*/
		.get(getCombinedHistoryLocalCsvUrl);

	return api;
};
