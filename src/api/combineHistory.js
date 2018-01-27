// @flow
import moment from 'moment';
import { createMasterTableFromLocalFiles } from '../utils';

// todo: learn to use real type definitions for express
type ReqType = { body?: Object };
type ResType = { json: Function };

const get = (
	req: ReqType,
	res: ResType,
): Object => {
	const parsedFiles = createMasterTableFromLocalFiles();
	return res.json(parsedFiles);
};

export default get;
