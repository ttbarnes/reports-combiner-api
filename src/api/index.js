// @flow

import { version } from '../../package.json';
import { Router } from 'express';
import {
	get,
	getCsvUrl
} from './combineHistory';

export default ({ config, db }: Object): Function => {
	let api = Router();

	api.route('/combined-history')
		/*
		* GET: combine multiple XLSX files into one, from 'history-files' directory
		*/
		.get(get);

	api.route('/download/combined-history')
		/*
			* POST: create new XLSX from multiple XLSX files, from 'history-files' directory
			* plan is to send the data from a client rather than using local files
			*/
		.get(getCsvUrl);

	return api;
};
