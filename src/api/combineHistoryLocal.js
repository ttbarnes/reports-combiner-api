// @flow
import { createMasterTableFromLocalFiles } from '../utils';
import createNewCsv from '../utils/createNewCsv';

// todo: learn to use real type definitions for express
type ReqType = { body?: Object };
type ResType = { json: Function, download: Function };

export const getCombinedHistoryLocal = (
	req: ReqType,
	res: ResType,
): Object => {
	const parsedFiles = createMasterTableFromLocalFiles();
	return res.json(parsedFiles);
};

export const getCombinedHistoryLocalCsvUrl
 = (
	req: ReqType,
	res: ResType,
): any => {
	createNewCsv().then((data: Object): ResType => { 
		return res.json({ link: data });
	});
};


