// @flow
import type { $Request, $Response } from 'express';
import { version } from '../../package.json';
import { Router } from 'express';
import login from '../controllers/auth';
import { checkTokenGetUserData } from '../controllers/token';
import userRoutes from './user';
import pocRoutes from './poc';
import snapshotRoutes from './snapshot';

export default ({ config, db }: any): any => {
	let router = Router();

	router.use('/user', userRoutes);

	router.use('/poc', pocRoutes);

	router.use('/snapshot', snapshotRoutes);

	// POST user auth/token check, returns user data
	router.route('/auth')
		.post(checkTokenGetUserData);

	// POST user login
	router.route('/auth/login')
		.post(login);

	return router;
};
