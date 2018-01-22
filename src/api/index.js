import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import { poc } from './poc';

export default ({ config, db }) => {
	let api = Router();


	api.route('/poc')
		.get(poc);

	return api;
}
